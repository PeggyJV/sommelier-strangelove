import React, { useState, useEffect } from "react"
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Icon,
  VStack,
  Button,
  HStack,
  Input,
  Spinner,
  Image,
  Stack,
  Text,
  Link,
  Tooltip,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, useWalletClient } from "wagmi"
import { getContract, parseUnits, PublicClient } from "viem"
import { toEther } from "utils/formatCurrency"
import { useHandleTransaction } from "hooks/web3"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalance } from "data/hooks/useUserBalance"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { Token } from "data/tokenConfig"
import { ModalOnlyTokenMenu } from "components/_menus/ModalMenu"
import { InformationIcon } from "components/_icons"
import { FAQAccordion } from "components/_cards/StrategyBreakdownCard/FAQAccordion"
import withdrawQueueV0821 from "src/abi/withdraw-queue-v0.8.21.json"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { WITHDRAW_DEADLINE_HOURS } from "src/constants/withdraw"
import { getAddress } from "viem"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { MaxUint256 } from "utils/bigIntHelpers"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useBoringQueueWithdrawals } from "data/hooks/useBoringQueueWithdrawals"
import { useWithdrawRequestStatus } from "data/hooks/useWithdrawRequestStatus"
import { logTxDebug } from "utils/txDebug"
import { config } from "utils/config"
import { getActiveProvider } from "context/rpc_context"
import { chainConfigMap } from "data/chainConfig"

interface FormValues {
  withdrawAmount: number
}

interface WithdrawQueueFormProps {
  onClose: () => void
  onSuccessfulWithdraw?: () => void
}

// Use global withdraw deadline (14 days) and express discount in basis points
// 0.25% => 25 bps
const DISCOUNT_BPS = 25

export const WithdrawQueueForm = ({
  onClose,
  onSuccessfulWithdraw,
}: WithdrawQueueFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const { id: _id } = useDepositModalStore()

  const { addToast, update, close, closeAll } = useBrandedToast()
  const { address } = useAccount()

  const id = (useRouter().query.id as string) || _id
  const cellarConfig = cellarDataMap[id].config

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const { data: boringQueueWithdrawals } = useBoringQueueWithdrawals(
    cellarConfig.cellar.address,
    cellarConfig.chain.id,
    { enabled: !!cellarConfig.boringQueue }
  )

  const { data: walletClient } = useWalletClient()

  // Get paid RPC client
  const [paidClient, setPaidClient] = useState<PublicClient | null>(
    null
  )

  useEffect(() => {
    const initializePaidClient = async () => {
      if (cellarConfig?.chain?.id) {
        const chainConfigData = chainConfigMap[cellarConfig.chain.id]
        if (chainConfigData) {
          const client = await getActiveProvider(chainConfigData)
          setPaidClient(client)
        }
      }
    }
    initializePaidClient()
  }, [cellarConfig?.chain?.id])

  const { boringQueue } = useCreateContracts(cellarConfig)

  const cellarContract = (() => {
    if (!paidClient) return
    return getContract({
      address: cellarConfig.cellar.address as `0x${string}`,
      abi: cellarConfig.cellar.abi,
      client: {
        public: paidClient,
        wallet: walletClient,
      },
    })
  })()

  const withdrawQueueContract = (() => {
    if (!paidClient) return
    return (
      boringQueue ??
      getContract({
        address: cellarConfig.chain
          .withdrawQueueAddress as `0x${string}`,
        abi: withdrawQueueV0821,
        client: {
          public: paidClient,
          wallet: walletClient,
        },
      })
    )
  })()

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken
  let strategyBaseAsset: Token = cellarConfig.baseAsset

  const modalFormMethods = useForm<FormValues>({
    defaultValues: {},
  })

  const [selectedToken, setSelectedToken] =
    useState<Token>(strategyBaseAsset)

  const [isWithdrawAllowed, setIsWithdrawAllowed] = useState<
    boolean | null
  >(null)

  // Store actual on-chain discount ranges from contract
  const [contractMinDiscountBps, setContractMinDiscountBps] =
    useState<number | null>(null)
  const [contractMaxDiscountBps, setContractMaxDiscountBps] =
    useState<number | null>(null)

  // Pre-validation of request: simulate on-chain call before enabling Submit
  const [isRequestValid, setIsRequestValid] = useState<
    boolean | null
  >(null)
  const [preflightMessage, setPreflightMessage] = useState<string>("")
  const [isValidating, setIsValidating] = useState<boolean>(false)
  const [discountBpsChosen, setDiscountBpsChosen] = useState<
    number | null
  >(null)
  const [effectiveDeadlineSec, setEffectiveDeadlineSec] = useState<
    number | null
  >(null)

  // Preflight: check if queue allows withdraws for selected asset (boring queue)
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        if (!boringQueue || !selectedToken?.address) {
          setIsWithdrawAllowed(null)
          setContractMinDiscountBps(null)
          setContractMaxDiscountBps(null)
          return
        }
        const res = await boringQueue.read.withdrawAssets([
          selectedToken.address,
        ])
        console.log("withdrawAssets response:", {
          token: selectedToken.symbol,
          address: selectedToken.address,
          rawResponse: res,
          isArray: Array.isArray(res),
        })

        // Parse the tuple: [allowWithdraws, secondsToMaturity, minimumSecondsToDeadline, minDiscount, maxDiscount, minimumShares]
        const allow = Array.isArray(res)
          ? Boolean(res[0])
          : Boolean(res)
        const minDiscount =
          Array.isArray(res) && res.length > 3 ? Number(res[3]) : null
        const maxDiscount =
          Array.isArray(res) && res.length > 4 ? Number(res[4]) : null

        console.log("withdrawAssets parsed values:", {
          allow,
          minDiscount,
          maxDiscount,
        })

        if (!cancelled) {
          setIsWithdrawAllowed(allow)
          setContractMinDiscountBps(minDiscount)
          setContractMaxDiscountBps(maxDiscount)
        }

        logTxDebug("withdraw.preflight", {
          assetOut: selectedToken.address,
          allow,
          minDiscount,
          maxDiscount,
          rawResponse: res,
        })
      } catch (e) {
        if (!cancelled) {
          setIsWithdrawAllowed(null)
          setContractMinDiscountBps(null)
          setContractMaxDiscountBps(null)
        }
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [boringQueue, selectedToken])

  function trackedSetSelectedToken(value: Token) {
    if (value && value !== selectedToken) {
      // analytics.track("deposit.stable-selected", {
      //   ...baseAnalytics,
      //   stable: value.symbol,
      // })
    }

    setSelectedToken(value)
  }

  const { doHandleTransaction } = useHandleTransaction()

  const watchWithdrawAmount = watch("withdrawAmount")

  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0

  const isActiveWithdrawRequest =
    useWithdrawRequestStatus(cellarConfig)

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)
  }

  const geo = useGeo()

  // Simulate the request with current inputs to pre‑validate before enabling submit
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      // Only validate for boringQueue path and when an amount is present
      if (!boringQueue || !selectedToken?.address) {
        setIsRequestValid(null)
        setPreflightMessage("")
        setDiscountBpsChosen(null)
        setEffectiveDeadlineSec(null)
        return
      }
      if (isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0) {
        setIsRequestValid(null)
        setPreflightMessage("")
        setDiscountBpsChosen(null)
        setEffectiveDeadlineSec(null)
        return
      }
      try {
        setIsValidating(true)
        // Compute shares and parameters exactly like in submit path
        const withdrawAmtInBaseDenom = parseUnits(
          `${watchWithdrawAmount}`,
          cellarConfig.cellar.decimals
        )

        // Check if approval is needed before simulating
        if (cellarContract && address) {
          try {
            const allowance = (await cellarContract.read.allowance([
              address,
              cellarConfig.boringQueue
                ? cellarConfig.boringQueue.address
                : cellarConfig.chain.withdrawQueueAddress,
            ])) as bigint

            if (allowance < withdrawAmtInBaseDenom) {
              setIsRequestValid(false)
              setPreflightMessage(
                `Approval required. Click "Withdraw" to approve and proceed.`
              )
              setDiscountBpsChosen(null)
              setEffectiveDeadlineSec(null)
              setIsValidating(false)
              return
            }
          } catch (approvalCheckError) {
            console.warn(
              "Could not check approval, continuing with simulation:",
              approvalCheckError
            )
          }
        }

        const tokenSymbolForRules = (selectedToken?.symbol ||
          "") as string
        const configuredRules: any = (cellarConfig as any)
          ?.withdrawTokenConfig?.[tokenSymbolForRules]

        // Use on-chain values if available, otherwise fall back to config
        const minBps =
          contractMinDiscountBps !== null
            ? contractMinDiscountBps
            : Number(configuredRules?.minDiscount ?? 0) * 100
        const maxBps =
          contractMaxDiscountBps !== null
            ? contractMaxDiscountBps
            : Number(configuredRules?.maxDiscount ?? 0) * 100
        const desiredBps = DISCOUNT_BPS
        const startBps =
          minBps && maxBps
            ? Math.max(minBps, Math.min(desiredBps, maxBps))
            : desiredBps
        const minDeadline = Number(
          configuredRules?.minimumSecondsToDeadline ?? 0
        )
        const policyDeadline = Math.floor(
          WITHDRAW_DEADLINE_HOURS * 60 * 60
        )
        const effectiveDeadlineSeconds = Math.max(
          policyDeadline,
          minDeadline
        )
        setEffectiveDeadlineSec(effectiveDeadlineSeconds)
        // Probe upwards in 25 bps steps until simulation succeeds
        const step = 25
        const upper = maxBps && maxBps > 0 ? maxBps : startBps
        let found: number | null = null
        let lastError: any = null
        let firstError: any = null
        console.log("Starting discount simulation loop:", {
          startBps,
          upper,
          step,
          minBps,
          maxBps,
          contractMinDiscountBps,
          contractMaxDiscountBps,
          usingContractValues:
            contractMinDiscountBps !== null &&
            contractMaxDiscountBps !== null,
          token: selectedToken.symbol,
        })
        for (let bps = startBps; bps <= upper; bps += step) {
          try {
            if (isActiveWithdrawRequest && boringQueueWithdrawals) {
              const request =
                boringQueueWithdrawals.open_requests[0].metadata
              const oldRequestTouple = [
                request.nonce,
                address,
                request.assetOut,
                request.amountOfShares,
                request.amountOfAssets,
                request.creationTime,
                request.secondsToMaturity,
                request.secondsToDeadline,
              ]
              await boringQueue.simulate.replaceOnChainWithdraw(
                [
                  oldRequestTouple,
                  BigInt(bps),
                  BigInt(effectiveDeadlineSeconds),
                ],
                { account: address }
              )
            } else {
              await boringQueue.simulate.requestOnChainWithdraw(
                [
                  selectedToken.address,
                  withdrawAmtInBaseDenom,
                  BigInt(bps),
                  BigInt(effectiveDeadlineSeconds),
                ],
                { account: address }
              )
            }
            found = bps
            console.log(`Discount ${bps} BPS succeeded`)
            break
          } catch (err) {
            if (!firstError) firstError = err
            lastError = err
            const errMsg = (
              (err as any)?.cause?.message ||
              (err as Error).message ||
              ""
            ).toString()
            console.log(
              `Discount ${bps} BPS failed:`,
              errMsg.slice(0, 200)
            )
            continue
          }
        }
        if (!cancelled) {
          if (found !== null) {
            setIsRequestValid(true)
            setDiscountBpsChosen(found)
            setPreflightMessage(
              `Queue minimum discount auto‑selected: ${(
                found / 100
              ).toFixed(2)}%`
            )
          } else {
            setIsRequestValid(false)
            // Analyze the first error to provide a helpful message (most informative)
            const errorToAnalyze = firstError || lastError
            if (errorToAnalyze) {
              const errorMsg = (
                (errorToAnalyze as any)?.cause?.message ||
                (errorToAnalyze as Error).message ||
                ""
              ).toString()
              console.error(
                "All withdraw simulations failed. First error:",
                errorMsg,
                {
                  token: selectedToken.symbol,
                  address: selectedToken.address,
                  amount: watchWithdrawAmount,
                  minBps,
                  maxBps,
                  startBps,
                  upper,
                }
              )

              if (
                errorMsg.includes(
                  "BoringOnChainQueue__WithdrawsNotAllowedForAsset"
                )
              ) {
                setPreflightMessage(
                  `Withdraw queue is currently not available for ${selectedToken.symbol}.`
                )
              } else if (
                errorMsg.includes(
                  "BoringOnChainQueue__BadShareAmount"
                )
              ) {
                setPreflightMessage(
                  `Invalid share amount. Check your withdrawal amount.`
                )
              } else if (
                errorMsg.includes("BoringOnChainQueue__Paused")
              ) {
                setPreflightMessage(
                  `Withdraw queue is currently paused. Please try again later.`
                )
              } else if (
                errorMsg.includes("BoringOnChainQueue__BadDeadline")
              ) {
                setPreflightMessage(
                  `Invalid deadline configuration. Please contact support.`
                )
              } else if (
                errorMsg.includes("BoringOnChainQueue__BadDiscount")
              ) {
                const minPct = minBps / 100
                const maxPct = maxBps / 100
                const source =
                  contractMinDiscountBps !== null
                    ? "on-chain"
                    : "config"
                setPreflightMessage(
                  `Discount validation failed. Expected range (${source}): ${minPct}%–${maxPct}%. The contract may have different values. Error: ${errorMsg.slice(
                    0,
                    80
                  )}`
                )
              } else if (
                errorMsg.includes(
                  "BoringOnChainQueue__RequestDeadlineExceeded"
                )
              ) {
                setPreflightMessage(
                  `Request deadline has been exceeded. Please try again.`
                )
              } else if (
                errorMsg.includes(
                  "BoringOnChainQueue__UserRepeatedlyCallingCancelOnWithdraw"
                )
              ) {
                setPreflightMessage(
                  `Too many cancel attempts. Please wait before trying again.`
                )
              } else if (
                errorMsg.includes(
                  "BoringOnChainQueue__NoWithdrawRequest"
                )
              ) {
                setPreflightMessage(
                  `No active withdraw request found to replace.`
                )
              } else if (errorMsg.includes("insufficient")) {
                setPreflightMessage(
                  `Insufficient balance or shares to complete this withdrawal.`
                )
              } else if (
                errorMsg.includes("TRANSFER_FROM_FAILED") ||
                errorMsg.includes("TransferFromFailed")
              ) {
                setPreflightMessage(
                  `Token transfer failed. You may need to approve the contract first. Click "Withdraw" to proceed with approval.`
                )
              } else {
                setPreflightMessage(
                  `Unable to validate withdrawal: ${errorMsg.slice(
                    0,
                    100
                  )}`
                )
              }
            } else {
              setPreflightMessage(
                `No valid discount rate found. Try a different amount or asset.`
              )
            }
          }
        }
      } catch (e) {
        if (cancelled) return
        const msg = (
          (e as any)?.cause?.message ||
          (e as Error).message ||
          ""
        ).toString()
        setIsRequestValid(false)
        if (
          msg.includes(
            "BoringOnChainQueue__WithdrawsNotAllowedForAsset"
          )
        ) {
          setPreflightMessage(
            `Withdraw queue is currently not available for ${selectedToken.symbol}.`
          )
        } else if (msg.includes("BoringOnChainQueue__BadDiscount")) {
          const rules: any = (cellarConfig as any)
            ?.withdrawTokenConfig?.[
            (selectedToken?.symbol || "") as string
          ]
          const minPct = rules?.minDiscount
          const maxPct = rules?.maxDiscount
          setPreflightMessage(
            `Discount invalid. Allowed range for ${selectedToken.symbol}: ${minPct}%–${maxPct}%.`
          )
        } else {
          setPreflightMessage(
            "Request not currently valid. Please review inputs and try again."
          )
        }
      } finally {
        if (!cancelled) setIsValidating(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [
    boringQueue,
    selectedToken?.address,
    selectedToken?.symbol,
    watchWithdrawAmount,
    isActiveWithdrawRequest,
    boringQueueWithdrawals,
    address,
    cellarConfig,
    contractMinDiscountBps,
    contractMaxDiscountBps,
    cellarContract,
  ])
  const onSubmit = async ({ withdrawAmount }: FormValues) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    if (withdrawAmount <= 0) return

    if (!address) {
      addToast({
        heading: "Withdraw Queue",
        status: "default",
        body: <Text>Connect Wallet</Text>,
        closeHandler: close,
        duration: null,
      })

      return
    }

    const withdrawAmtInBaseDenom = parseUnits(
      `${withdrawAmount}`,
      cellarConfig.cellar.decimals
    )

    // Check if user has sufficient balance
    if (!lpTokenData || lpTokenData.value < withdrawAmtInBaseDenom) {
      addToast({
        heading: "Insufficient Balance",
        status: "error",
        body: (
          <Text>
            You don&apos;t have enough{" "}
            {lpTokenData?.symbol || "tokens"} to withdraw this amount.
            <br />
            Available: {lpTokenData?.formatted || "0"}
            <br />
            Requested: {withdrawAmount}
          </Text>
        ),
        closeHandler: closeAll,
      })
      return
    }

    const allowance = (await cellarContract?.read.allowance([
      address!,
      getAddress(
        cellarConfig.boringQueue
          ? cellarConfig.boringQueue.address
          : cellarConfig.chain.withdrawQueueAddress
      ),
    ])) as bigint

    let needsApproval
    try {
      needsApproval = (allowance as bigint) < withdrawAmtInBaseDenom
    } catch (e) {
      const error = e as Error
      console.error("Invalid Input: ", error.message)
      return
    }

    if (needsApproval) {
      try {
        // @ts-ignore
        const hash = await cellarContract?.write.approve(
          [
            getAddress(
              cellarConfig.boringQueue
                ? cellarConfig.boringQueue.address
                : cellarConfig.chain.withdrawQueueAddress
            ),
            MaxUint256,
          ],
          { account: address }
        )
        addToast({
          heading: "ERC20 Approval",
          status: "default",
          body: <Text>Approving ERC20</Text>,
          isLoading: true,
          closeHandler: close,
          duration: null,
        })
        const waitForApproval = wait({ confirmations: 1, hash })
        const result = await waitForApproval
        if (result?.data?.transactionHash) {
          // analytics.track("deposit.approval-granted", {
          //   ...baseAnalytics,
          //   stable: tokenSymbol,
          //   value: depositAmount,
          // })

          update({
            heading: "ERC20 Approval",
            body: <Text>ERC20 Approved</Text>,
            status: "success",
            closeHandler: closeAll,
          })
        } else if (result?.error) {
          // analytics.track("deposit.approval-failed", {
          //   ...baseAnalytics,
          //   stable: tokenSymbol,
          //   value: depositAmount,
          // })

          update({
            heading: "ERC20 Approval",
            body: <Text>Approval Failed</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }
      } catch (e) {
        const error = e as Error
        console.error(error.message)
        // analytics.track("deposit.approval-cancelled", {
        //   ...baseAnalytics,
        //   stable: tokenSymbol,
        //   value: depositAmount,
        // })

        addToast({
          heading: "ERC20 Approval",
          body: <Text>Approval Cancelled</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }
    }

    try {
      // Add debugging information
      console.log("Withdraw attempt details:", {
        selectedToken: selectedToken?.symbol,
        withdrawAmount: withdrawAmount,
        withdrawAmtInBaseDenom: withdrawAmtInBaseDenom.toString(),
        lpTokenBalance: lpTokenData?.formatted,
        lpTokenValue: lpTokenData?.value?.toString(),
        isActiveWithdrawRequest,
        boringQueue: !!boringQueue,
        cellarAddress: cellarConfig.cellar.address,
      })

      // Guard: if boring queue and asset disabled, show UI and stop
      if (boringQueue && isWithdrawAllowed === false) {
        addToast({
          heading: "Withdraw Queue",
          status: "info",
          body: (
            <Text>
              Withdraw queue is currently not available for{" "}
              {selectedToken.symbol}. Please choose a different asset
              or try again later.
            </Text>
          ),
          closeHandler: closeAll,
        })
        logTxDebug("withdraw.blocked_asset", {
          assetOut: selectedToken.address,
        })
        return
      }

      let hash = await doWithdrawTx(
        selectedToken,
        withdrawAmtInBaseDenom
      )

      const onSuccess = () => {
        if (onSuccessfulWithdraw) {
          onSuccessfulWithdraw()
        }

        onClose() // Close modal after successful withdraw.
      }

      const onError = (error: Error) => {
        // Can track here if we want
      }

      await doHandleTransaction({
        cellarConfig,
        hash,
        onSuccess,
        onError,
      })
    } catch (e) {
      const error = e as Error
      console.error(error)

      if (error.message === "GAS_LIMIT_ERROR") {
        const causeMsg = (error as any)?.cause?.message || ""
        if (
          causeMsg.includes(
            "BoringOnChainQueue__WithdrawsNotAllowedForAsset"
          )
        ) {
          addToast({
            heading: "Withdraw Queue",
            body: (
              <Text>
                Withdraw queue is currently not available for{" "}
                {selectedToken.symbol}. Please choose a different
                asset or try again later.
              </Text>
            ),
            status: "info",
            closeHandler: closeAll,
          })
          logTxDebug("withdraw.error_not_allowed", {
            assetOut: selectedToken.address,
          })
          return
        }
        if (causeMsg.includes("BoringOnChainQueue__BadDiscount")) {
          const tokenSymbol = (selectedToken?.symbol || "") as string
          const rules: any = (cellarConfig as any)
            ?.withdrawTokenConfig?.[tokenSymbol]
          const minPct = rules?.minDiscount ?? undefined
          const maxPct = rules?.maxDiscount ?? undefined
          addToast({
            heading: "Withdraw Queue",
            body: (
              <Text>
                Withdraw request rejected: discount is invalid.
                {minPct !== undefined && maxPct !== undefined
                  ? ` Allowed range for ${selectedToken.symbol}: ${minPct}%–${maxPct}%.`
                  : ""}
              </Text>
            ),
            status: "info",
            closeHandler: closeAll,
          })
          logTxDebug("withdraw.error_bad_discount", {
            assetOut: selectedToken.address,
          })
          return
        }
        addToast({
          heading: "Transaction not submitted",
          body: (
            <Text>
              Your transaction has failed, if it does not work after
              waiting some time and retrying please send a message in
              our{" "}
              {
                <Link
                  href="https://discord.com/channels/814266181267619840/814279703622844426"
                  isExternal
                  textDecoration="underline"
                >
                  Discord Support channel
                </Link>
              }{" "}
              tagging a member of the front end team.
            </Text>
          ),
          status: "info",
          closeHandler: closeAll,
        })
      } else {
        console.error(error)
        addToast({
          heading: "Withdraw Queue",
          body: <Text>Withdraw Queue Order Cancelled</Text>,
          status: "error",
          closeHandler: closeAll,
        })
      }

      refetch()
    }
  }

  const doWithdrawTx = async (
    selectedToken: Token,
    withdrawAmtInBaseDenom: bigint
  ) => {
    const currentTime = Math.floor(Date.now() / 1000)
    const tokenSymbolForRules = (selectedToken?.symbol ||
      "") as string
    const configuredRules: any = (cellarConfig as any)
      ?.withdrawTokenConfig?.[tokenSymbolForRules]
    const minBps = Number(configuredRules?.minDiscount ?? 0) * 100
    const maxBps = Number(configuredRules?.maxDiscount ?? 0) * 100
    // Our desired default is 25 bps; clamp to per-asset rules if present
    const desiredBps = DISCOUNT_BPS
    // Prefer the pre‑validated/auto‑selected discount if available
    const discountBps =
      discountBpsChosen !== null
        ? discountBpsChosen
        : minBps && maxBps
        ? Math.max(minBps, Math.min(desiredBps, maxBps))
        : desiredBps
    const minDeadline = Number(
      configuredRules?.minimumSecondsToDeadline ?? 0
    )
    const policyDeadline = Math.floor(
      WITHDRAW_DEADLINE_HOURS * 60 * 60
    )
    const effectiveDeadlineSeconds =
      effectiveDeadlineSec !== null
        ? effectiveDeadlineSec
        : Math.max(policyDeadline, minDeadline)
    const absoluteDeadlineSeconds =
      currentTime + effectiveDeadlineSeconds

    let hash

    if (boringQueue) {
      const discount = BigInt(discountBps)

      const deadlineSeconds = BigInt(effectiveDeadlineSeconds)

      if (isActiveWithdrawRequest && boringQueueWithdrawals) {
        // Replace existing BoringQueuerequest
        const request =
          boringQueueWithdrawals.open_requests[0].metadata

        const oldRequestTouple = [
          request.nonce,
          address,
          request.assetOut,
          request.amountOfShares,
          request.amountOfAssets,
          request.creationTime,
          request.secondsToMaturity,
          request.secondsToDeadline,
        ]

        const gasLimitEstimated = await estimateGasLimitWithRetry(
          boringQueue.estimateGas.replaceOnChainWithdraw,
          boringQueue.simulate.replaceOnChainWithdraw,
          [oldRequestTouple, discount, deadlineSeconds],
          330000,
          address
        )

        // @ts-ignore
        hash = await boringQueue?.write.replaceOnChainWithdraw(
          [oldRequestTouple, discount, deadlineSeconds],
          {
            gas: gasLimitEstimated,
            account: address,
          }
        )
      } else {
        // Create new BoringQueue request
        const gasLimitEstimated = await estimateGasLimitWithRetry(
          boringQueue.estimateGas.requestOnChainWithdraw,
          boringQueue.simulate.requestOnChainWithdraw,
          [
            selectedToken?.address,
            withdrawAmtInBaseDenom,
            discount,
            deadlineSeconds,
          ],
          330000,
          address
        )

        // @ts-ignore
        hash = await boringQueue?.write.requestOnChainWithdraw(
          [
            selectedToken?.address,
            withdrawAmtInBaseDenom,
            discount,
            deadlineSeconds,
          ],
          {
            gas: gasLimitEstimated,
            account: address,
          }
        )
      }
    } else {
      // Create or replace WithdrawQueue request
      const previewRedeem = parseInt(
        await fetchCellarPreviewRedeem(
          id,
          BigInt(10 ** cellarConfig.cellar.decimals)
        )
      )

      const sharePriceStandardized =
        previewRedeem / 10 ** cellarConfig.baseAsset.decimals
      const sharePriceWithDiscount = sharePriceStandardized
      const sharePriceWithDiscountInBaseDenom = Math.floor(
        sharePriceWithDiscount * 10 ** cellarConfig.baseAsset.decimals
      )

      const withdrawTouple = [
        BigInt(absoluteDeadlineSeconds),
        BigInt(sharePriceWithDiscountInBaseDenom),
        withdrawAmtInBaseDenom,
        false,
      ]
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        withdrawQueueContract?.estimateGas.updateWithdrawRequest,
        withdrawQueueContract?.simulate.updateWithdrawRequest,
        [cellarConfig.cellar.address, withdrawTouple],
        330000,
        address
      )
      // @ts-ignore
      hash = await withdrawQueueContract?.write.updateWithdrawRequest(
        [cellarConfig.cellar.address, withdrawTouple],
        {
          gas: gasLimitEstimated,
          account: address,
        }
      )
    }

    return hash
  }

  return (
    <VStack
      as="form"
      spacing={8}
      align="stretch"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormProvider {...modalFormMethods}>
        <FormControl isInvalid={!!errors.withdrawAmount}>
          {isActiveWithdrawRequest && (
            <>
              <HStack
                p={4}
                mb={boringQueue ? 0 : 12}
                spacing={4}
                align="flex-start"
                backgroundColor="purple.dark"
                border="2px solid"
                borderRadius={16}
                borderColor="purple.base"
              >
                <Text
                  color="white"
                  fontSize="s"
                  textAlign={"center"}
                  fontWeight={"bold"}
                >
                  You currently have a withdraw request pending in the
                  queue, submitting a new withdraw request will
                  replace your current one.
                </Text>
              </HStack>
              <br />
            </>
          )}
          {isActiveWithdrawRequest && boringQueue && (
            <>
              <HStack
                p={4}
                mb={12}
                spacing={4}
                align="flex-start"
                backgroundColor="purple.dark"
                border="2px solid"
                borderRadius={16}
                borderColor="purple.base"
              >
                <Text
                  color="white"
                  fontSize="s"
                  textAlign={"center"}
                  fontWeight={"bold"}
                >
                  {((useRouter().query.id as string) || _id) ===
                  config.CONTRACT.ALPHA_STETH.SLUG
                    ? "When replacing a BoringQueue request, your amount and asset are preserved; the deadline and discount can be updated."
                    : "When replacing a BoringQueue request, only the deadline is updated."}
                </Text>
              </HStack>
              <br />
            </>
          )}
          <Stack spacing={5}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              Enter Shares
            </Text>
            <HStack
              backgroundColor="surface.tertiary"
              justifyContent="space-between"
              borderRadius={16}
              px={4}
              py={3}
              height="64px"
            >
              <HStack>
                <Image
                  width="16px"
                  height="16px"
                  src={cellarConfig.lpToken.imagePath}
                  alt="coinlogo"
                />
                <Text fontWeight="semibold">
                  {lpTokenData?.symbol}
                </Text>
              </HStack>
              <VStack spacing={0} align="flex-end">
                <Input
                  id="amount"
                  variant="unstyled"
                  pr="2"
                  type="number"
                  step="any"
                  defaultValue="0.00"
                  placeholder="0.00"
                  fontSize="lg"
                  fontWeight={700}
                  disabled={isActiveWithdrawRequest && !!boringQueue}
                  textAlign="right"
                  {...register("withdrawAmount", {
                    onChange: (event) => {
                      let val = event.target.value

                      const decimalPos = val.indexOf(".")

                      if (
                        decimalPos !== -1 &&
                        val.length - decimalPos - 1 >
                          cellarConfig.cellar.decimals
                      ) {
                        val = val.substring(
                          0,
                          decimalPos +
                            cellarConfig.cellar.decimals +
                            1
                        ) // Keep token decimal places as max
                        event.target.value = val
                      }
                    },
                    required: "Enter amount",
                    valueAsNumber: true,
                    validate: {
                      positive: (v) =>
                        v > 0 || "You must submit a positive amount.",
                      balance: (v) =>
                        v <=
                          parseFloat(
                            toEther(
                              lpTokenData?.formatted,
                              lpTokenData?.decimals,
                              false,
                              6
                            )
                          ) || "Insufficient balance",
                    },
                  })}
                />
                <HStack spacing={0} fontSize="10px">
                  {isBalanceLoading ? (
                    <Spinner size="xs" mr="2" />
                  ) : (
                    <>
                      <Text as="span">
                        Available:{" "}
                        {(lpTokenData &&
                          toEther(
                            lpTokenData.value,
                            lpTokenData.decimals,
                            false,
                            6
                          )) ||
                          "--"}
                      </Text>
                      <Button
                        variant="unstyled"
                        p={0}
                        w="max-content"
                        h="max-content"
                        textTransform="uppercase"
                        fontSize="inherit"
                        fontWeight={600}
                        onClick={setMax}
                        disabled={
                          isActiveWithdrawRequest && !!boringQueue
                        }
                      >
                        max
                      </Button>
                    </>
                  )}
                </HStack>
              </VStack>
            </HStack>

            <FormErrorMessage color="energyYellow">
              <Icon
                p={0.5}
                mr={1}
                color="surface.bg"
                bg="red.base"
                borderRadius="50%"
                as={AiOutlineInfo}
              />
              {errors.withdrawAmount?.message}
            </FormErrorMessage>
            <HStack justify="space-between">
              <Text as="span">Asset Out</Text>
              {
                <ModalOnlyTokenMenu
                  depositTokens={
                    cellarConfig.boringVault
                      ? ((useRouter().query.id as string) || _id) ===
                        config.CONTRACT.ALPHA_STETH.SLUG
                        ? Object.keys(
                            cellarDataMap[id].config
                              .withdrawTokenConfig!
                          )
                        : Object.keys(
                            cellarDataMap[id].config
                              .withdrawTokenConfig!
                          ).filter((sym) =>
                            sym === "WETH"
                              ? true
                              : isWithdrawAllowed === null
                              ? true
                              : sym === selectedToken.symbol
                              ? true
                              : true
                          )
                      : [strategyBaseAsset.symbol]
                  }
                  activeAsset={
                    ((useRouter().query.id as string) || _id) ===
                    config.CONTRACT.ALPHA_STETH.SLUG
                      ? selectedToken.address
                      : strategyBaseAsset.address
                  }
                  setSelectedToken={trackedSetSelectedToken}
                  isDisabled={
                    isActiveWithdrawRequest && !!boringQueue
                  }
                />
              }
            </HStack>
          </Stack>
        </FormControl>
        <Stack spacing={5}>
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="neutral.400"
          >
            Transaction Details
          </Text>
          <Stack spacing={2.5}>
            <TransactionDetailItem
              title="Vault"
              value={<Text>{cellarDataMap[id].name}</Text>}
            />
          </Stack>
        </Stack>
      </FormProvider>

      <BaseButton
        type="submit"
        isDisabled={
          isDisabled ||
          (boringQueue ? isWithdrawAllowed === false : false) ||
          (boringQueue
            ? isRequestValid === false &&
              !preflightMessage?.includes("Approval required")
            : false) ||
          isValidating
        }
        isLoading={isSubmitting}
        fontSize={21}
        py={6}
        px={12}
      >
        {boringQueue &&
        isRequestValid === false &&
        preflightMessage?.includes("Approval required")
          ? "Approve & Withdraw"
          : isActiveWithdrawRequest && boringQueue
          ? "Replace Request"
          : "Submit"}
      </BaseButton>
      {((useRouter().query.id as string) || _id) ===
        config.CONTRACT.ALPHA_STETH.SLUG &&
        boringQueue &&
        isRequestValid &&
        preflightMessage && (
          <Text color="neutral.300" fontSize="sm">
            {preflightMessage}
          </Text>
        )}
      {boringQueue && isWithdrawAllowed === false && (
        <Text color="yellow.300" fontSize="sm">
          {preflightMessage ||
            `Withdraw queue is currently not available for ${selectedToken.symbol}.`}
        </Text>
      )}
      {boringQueue &&
        isWithdrawAllowed !== false &&
        isRequestValid === false && (
          <Text
            color={
              preflightMessage?.includes("Approval required")
                ? "blue.300"
                : "yellow.300"
            }
            fontSize="sm"
          >
            {preflightMessage ||
              `Request not currently valid. Please review inputs and try again.`}
          </Text>
        )}
      {/*waitTime(cellarConfig) !== null && (
        <Text textAlign="center">
          Please wait {waitTime(cellarConfig)} after the deposit to
          enter the Withdraw Queue.
        </Text>
      )*/}
      {!cellarConfig.boringVault && (
        <FAQAccordion
          data={[
            {
              question: "What is the Withdraw Queue?",
              answer: `The Withdraw Queue is a way for users to submit a withdraw request if they are trying to withdraw more than the liquid reserve from a strategy. Once the request is submitted, it will be eventually fulfilled on behalf of the user and the withdrawn funds will appear automatically in the user's wallet (assuming the requests is fulfilled within the time constraint specified by the user). A withdraw request through the queue also has a much lower gas cost for users compared to instant withdrawals.`,
            },
          ]}
        />
      )}
    </VStack>
  )
}

const TransactionDetailItem = ({
  title,
  value,
}: {
  title: string
  value: React.ReactNode
}) => {
  return (
    <HStack alignItems="flex-start" justifyContent="space-between">
      <Text color="neutral.300">{title}</Text>
      <Stack>{value}</Stack>
    </HStack>
  )
}

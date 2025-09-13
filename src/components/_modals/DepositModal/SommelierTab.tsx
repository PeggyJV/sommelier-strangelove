import {
  HStack,
  ModalProps,
  Text,
  VStack,
  FormControl,
  FormErrorMessage,
  Icon,
  Spinner,
  Avatar,
  Tooltip,
  UseDisclosureProps,
} from "@chakra-ui/react"

import { useEffect, useState, type JSX } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { AiOutlineInfo } from "react-icons/ai"
import { ModalMenu } from "components/_menus/ModalMenu"
import {
  depositAssetTokenConfig,
  Token as TokenType,
  tokenConfig,
  getTokenConfig,
} from "data/tokenConfig"
import { Link } from "components/Link"
import { config } from "utils/config"
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  useSwitchChain,
} from "wagmi"
import {
  erc20Abi,
  getContract,
  parseUnits,
  getAddress,
  PublicClient,
} from "viem"

import { useBrandedToast } from "hooks/chakra"
// import { insertEvent } from "utils/supabase"
import {
  InformationIcon,
  GreenCheckCircleIcon,
} from "components/_icons"
import { CardHeading } from "components/_typography/CardHeading"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { ExternalLinkIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { waitTime, depositAssetDefaultValue } from "data/uiConfig"
import { useGeo } from "context/geoContext"
import { useImportToken } from "hooks/web3/useImportToken"
import { useStrategyData } from "data/hooks/useStrategyData"
import { alphaStethI18n } from "i18n/alphaSteth"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { FaExternalLinkAlt } from "react-icons/fa"
import { BaseButton } from "components/_buttons/BaseButton"
import { useUserBalances } from "data/hooks/useUserBalances"
import {
  handleTransactionError,
  getTransactionErrorToast,
  getTransactionErrorAnalytics,
  type TransactionErrorContext,
} from "utils/handleTransactionError"
import { logTxDebug } from "utils/txDebug"
import { getActiveProvider } from "context/rpc_context"
import { chainConfigMap } from "data/chainConfig"

interface FormValues {
  depositAmount: number
  slippage: number
  selectedToken: TokenType
}

interface DepositModalProps
  extends Pick<ModalProps, "isOpen" | "onClose"> {
  notifyModal?: UseDisclosureProps
}

//! This handles all deposits, not just the tab
export const SommelierTab = ({
  notifyModal,
  ...props
}: DepositModalProps) => {
  const { id: _id } = useDepositModalStore()
  const id = (useRouter().query.id as string) || _id
  const cellarData = cellarDataMap[id]
  const cellarConfig = cellarData.config
  const cellarName = cellarData.name
  const cellarAddress = cellarConfig.id

  let depositTokens: string[] = cellarData.depositTokens.list
  // Drop base asset from deposit token list
  depositTokens = depositTokens.filter(
    (token) => token !== cellarConfig.baseAsset.symbol
  )

  // Put base asset at the top of the token list
  depositTokens.unshift(cellarConfig.baseAsset.symbol)

  const { addToast, update, close, closeAll } = useBrandedToast()

  const currentStrategies =
    window.location.pathname?.split("/")[2]?.replace(/-/g, " ") ||
    id.replace(/-/g, " ") ||
    ""

  const importToken = useImportToken({
    onSuccess: (data) => {
      const tokenData = data as unknown as { symbol: string }
      addToast({
        heading: "Import Token",
        status: "success",
        body: <Text>{tokenData.symbol} added to metamask</Text>,
        closeHandler: close,
      })
    },
    onError: (error) => {
      const e = error as Error
      addToast({
        heading: "Import Token",
        status: "error",
        body: <Text>{e.message}</Text>,
        closeHandler: close,
      })
    },
  })

  // Base Analytics data to differentiate between cellars
  const baseAnalytics = {
    cellarName,
    cellarAddress,
  }

  const { address, chain } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { writeContractAsync } = useWriteContract()
  const { data: waitForTransaction } = useWaitForTransactionReceipt()
  const geo = useGeo()

  // Attribution (deposit started/receipt/error): send to ingestion API using Vercel KV backend
  const sendIngest = async (evt: any) => {
    try {
      if (process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED !== "true")
        return
      await fetch("/api/ingest-rpc", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ events: [evt] }),
        keepalive: true,
      })
    } catch {}
  }

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const [selectedToken, setSelectedToken] =
    useState<TokenType | null>(null)
  const [isDepositFeeLoading, setIsDepositFeeLoading] =
    useState(false)
  const [depositFee, setDepositFee] = useState(0)
  const methods = useForm<FormValues>({
    defaultValues: { slippage: config.SWAP.SLIPPAGE },
  })

  // Set default selected token when component mounts
  useEffect(() => {
    if (!selectedToken && depositTokens.length > 0) {
      const depositTokenConfig = getTokenConfig(
        depositTokens,
        cellarConfig.chain.id
      ) as TokenType[]

      // Get the default deposit asset for this cellar
      const defaultAssetSymbol =
        depositAssetDefaultValue(cellarConfig)
      const defaultToken =
        depositTokenConfig.find(
          (token) => token.symbol === defaultAssetSymbol
        ) || depositTokenConfig[0]

      setSelectedToken(defaultToken)
    }
  }, [selectedToken, depositTokens, cellarConfig])
  const {
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods
  const watchDepositAmount = watch("depositAmount")
  const isError =
    errors.depositAmount !== undefined ||
    errors.slippage !== undefined
  // Balance/chain guards
  const desiredChainId = cellarConfig?.chain?.wagmiId
  const needsSwitch = !!desiredChainId && chain?.id !== desiredChainId

  const { cellarSigner, boringVaultLens } =
    useCreateContracts(cellarConfig)

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const isAlpha = id === config.CONTRACT.ALPHA_STETH.SLUG
  const netApy = strategyData?.baseApySumRewards?.formatted

  const { userBalances } = useUserBalances()

  const selectedTokenBalance = userBalances.data?.find(
    (b) => b.symbol === selectedToken?.symbol
  )

  const availableAmount = Number(selectedTokenBalance?.formatted ?? 0)
  const insufficientBalance =
    Number.isFinite(availableAmount) &&
    Number(watchDepositAmount) > availableAmount
  const isDisabled =
    isNaN(watchDepositAmount) ||
    watchDepositAmount <= 0 ||
    isError ||
    insufficientBalance ||
    needsSwitch

  // Debug snapshot
  logTxDebug("deposit.ui_state", {
    id,
    cellarName,
    chainId: chain?.id,
    desiredChainId,
    needsSwitch,
    selectedToken: selectedToken?.symbol,
    selectedTokenAddress: selectedToken?.address,
    depositAmount: watchDepositAmount,
    availableAmount,
    insufficientBalance,
    isDisabled,
  })

  // Get paid RPC client
  const [paidClient, setPaidClient] = useState<PublicClient | null>(
    null
  )

  useEffect(() => {
    const initializePaidClient = async () => {
      if (cellarConfig?.chain?.id) {
        const chainConfig = chainConfigMap[cellarConfig.chain.id]
        if (chainConfig) {
          const client = await getActiveProvider(chainConfig)
          setPaidClient(client)
        }
      }
    }
    initializePaidClient()
  }, [cellarConfig?.chain?.id])

  // ERC20 contract for the currently selected token (not always base asset)
  const erc20Contract =
    selectedToken?.address &&
    paidClient &&
    getContract({
      address: getAddress(selectedToken.address),
      abi: erc20Abi,
      client: {
        public: paidClient,
      },
    })

  const cellarContract =
    paidClient &&
    getContract({
      address: getAddress(cellarConfig.cellar.address),
      abi: cellarConfig.cellar.abi,
      client: {
        public: paidClient,
      },
    })

  const queryDepositFeePercent = async (assetAddress: string) => {
    if (
      assetAddress === cellarConfig.baseAsset.address ||
      cellarConfig.boringVault
    ) {
      return 0
    }

    const result = await cellarSigner?.read.alternativeAssetData([
      assetAddress,
    ])
    if (!result) return 0

    const [isSupported, _, depositFee] = result as [boolean, any, any]

    return isSupported ? Number(depositFee) : 0
  }

  // Helper: wrap writeContractAsync and swallow user-rejected with toast, returning undefined
  const safeWriteContract = async (
    params: Parameters<typeof writeContractAsync>[0],
    context: TransactionErrorContext
  ): Promise<string | undefined> => {
    try {
      logTxDebug("write.request", {
        to: (params as any)?.address,
        fn: (params as any)?.functionName,
        args: (params as any)?.args,
        value: (params as any)?.value,
        context,
      })
      const hash = await writeContractAsync(params)
      logTxDebug("write.submitted", { hash })
      return hash
    } catch (e) {
      logTxDebug("write.error", { message: (e as Error)?.message })
      const normalized = handleTransactionError(e as Error, context)
      if (normalized.type === "USER_REJECTED") {
        logTxDebug("write.rejected", { context })
        const toastConfig = getTransactionErrorToast(
          normalized,
          context
        )
        const analyticsData = getTransactionErrorAnalytics(
          normalized,
          context
        )
        analytics.track(`${context.transactionType}.rejected`, {
          ...baseAnalytics,
          ...analyticsData,
        })
        const toastBody = toastConfig.showPopupGuidance ? (
          <Text>
            {toastConfig.body}
            <br />
            Enable popups for MetaMask and retry.
          </Text>
        ) : (
          <Text>{toastConfig.body}</Text>
        )
        addToast({
          heading: toastConfig.heading,
          body: toastBody,
          status: toastConfig.status,
          closeHandler: closeAll,
        })
        return undefined
      }
      throw e
    }
  }

  const doDepositTx = async (
    nativeDeposit: boolean,
    amtInWei: bigint,
    assetAddress: string
  ): Promise<any> => {
    let fnName: string
    let args: any[]
    let value: bigint

    if (cellarConfig.boringVault) {
      const minimumMint = await boringVaultLens?.read.previewDeposit([
        assetAddress,
        amtInWei,
        cellarConfig.cellar.address,
        cellarConfig.accountant?.address,
      ])
      fnName = "deposit"
      args = [assetAddress, amtInWei, minimumMint]
      value = nativeDeposit ? amtInWei : BigInt(0)
    } else if (
      assetAddress !== undefined &&
      assetAddress.toLowerCase() !==
        cellarConfig.baseAsset.address.toLowerCase()
    ) {
      const minimumMint = await cellarSigner?.read.previewDeposit([
        assetAddress,
        amtInWei,
      ])
      fnName = "deposit"
      args = [assetAddress, amtInWei, minimumMint]
      value = BigInt(0)
    } else {
      const minimumMint = await cellarSigner?.read.previewDeposit([
        amtInWei,
      ])
      fnName = "deposit"
      args = [amtInWei, address]
      value = BigInt(0)
    }

    try {
      const contractParams: any = {
        address: cellarSigner?.address as `0x${string}`,
        abi: cellarSigner?.abi ?? cellarConfig.cellar.abi,
        functionName: fnName,
        args: args,
      }

      if (value > 0) {
        contractParams.value = value
      }

      const hash = await safeWriteContract(contractParams, {
        vaultName: cellarName,
        tokenSymbol: selectedToken?.symbol,
        transactionType: "deposit",
        chainId: cellarConfig.chain.wagmiId,
      })

      if (hash) {
        addToast({
          heading: "Deposit in Progress",
          body: <Text>Your deposit is being processed.</Text>,
          status: "info",
          closeHandler: close,
        })

        const receipt = await paidClient?.waitForTransactionReceipt({
          hash: hash as `0x${string}`,
        })

        if (receipt?.status === "success") {
          addToast({
            heading: "Deposit Successful",
            body: (
              <Text>
                Your deposit has been completed successfully.
              </Text>
            ),
            status: "success",
            closeHandler: close,
          })
          return [receipt]
        } else {
          addToast({
            heading: "Deposit Failed",
            body: <Text>Deposit failed. Please try again.</Text>,
            status: "error",
            closeHandler: close,
          })
          throw new Error("Deposit failed")
        }
      }
    } catch (error) {
      console.error("Deposit error:", error)
      throw error
    }
  }

  const doApprovalTx = async (
    amtInWei: bigint,
    tokenAddress: string,
    spender: string
  ): Promise<boolean> => {
    try {
      const hash = await safeWriteContract(
        {
          address: tokenAddress as `0x${string}`,
          abi: erc20Abi,
          functionName: "approve",
          args: [spender as `0x${string}`, amtInWei],
        },
        {
          vaultName: cellarName,
          tokenSymbol: selectedToken?.symbol,
          transactionType: "approve",
          chainId: cellarConfig.chain.wagmiId,
        }
      )

      if (hash) {
        addToast({
          heading: "Approving Token",
          body: <Text>Please approve the token transfer.</Text>,
          status: "info",
          closeHandler: close,
        })

        const receipt = await paidClient?.waitForTransactionReceipt({
          hash: hash as `0x${string}`,
        })

        if (receipt?.status === "success") {
          addToast({
            heading: "Token Approved",
            body: <Text>Token approval successful.</Text>,
            status: "success",
            closeHandler: close,
          })
          return true
        } else {
          addToast({
            heading: "Approval Failed",
            body: <Text>Token approval failed.</Text>,
            status: "error",
            closeHandler: close,
          })
          return false
        }
      }
      return false
    } catch (error) {
      console.error("Approval error:", error)

      // Use centralized error handling for approval
      const errorContext: TransactionErrorContext = {
        vaultName: cellarName,
        tokenSymbol: selectedToken?.symbol,
        transactionType: "approve",
        chainId: cellarConfig.chain.wagmiId,
      }

      const normalizedError = handleTransactionError(
        error as Error,
        errorContext
      )
      const toastConfig = getTransactionErrorToast(
        normalizedError,
        errorContext
      )
      const analyticsData = getTransactionErrorAnalytics(
        normalizedError,
        errorContext
      )

      // Track analytics
      analytics.track("approval.rejected", {
        ...analyticsData,
      })

      // Show toast with popup guidance if needed
      const toastBody = toastConfig.showPopupGuidance ? (
        <Text>
          {toastConfig.body}
          <br />
          Enable popups for MetaMask and retry.
        </Text>
      ) : (
        <Text>{toastConfig.body}</Text>
      )

      addToast({
        heading: toastConfig.heading,
        body: toastBody,
        status: toastConfig.status,
        closeHandler: close,
      })
      return false
    }
  }

  const deposit = async (
    amtInWei: bigint,
    tokenAddress: string,
    approval: boolean,
    canDoBatchCall: boolean,
    isNativeDeposit: boolean
  ): Promise<any[]> => {
    try {
      let hash: string

      // For BoringVault (like Alpha STETH), use the teller contract
      if (cellarConfig.teller) {
        // Calculate minimum mint amount (0 for now, can be enhanced later)
        const minimumMint = 0n

        if (isNativeDeposit) {
          // Native ETH deposit
          const tellerParams: any = {
            address: cellarConfig.teller.address as `0x${string}`,
            abi: cellarConfig.teller.abi,
            functionName: "deposit",
            args: [tokenAddress, amtInWei, minimumMint],
          }

          if (amtInWei > 0) {
            tellerParams.value = amtInWei
          }

          hash = (await safeWriteContract(tellerParams, {
            vaultName: cellarName,
            tokenSymbol: selectedToken?.symbol,
            transactionType: "deposit",
            chainId: cellarConfig.chain.wagmiId,
          })) as string
        } else {
          // ERC20 token deposit
          hash = (await safeWriteContract(
            {
              address: cellarConfig.teller.address as `0x${string}`,
              abi: cellarConfig.teller.abi,
              functionName: "deposit",
              args: [tokenAddress, amtInWei, minimumMint],
            },
            {
              vaultName: cellarName,
              tokenSymbol: selectedToken?.symbol,
              transactionType: "deposit",
              chainId: cellarConfig.chain.wagmiId,
            }
          )) as string
        }
      } else {
        // Standard cellar deposit
        if (isNativeDeposit) {
          // Native ETH deposit
          const cellarParams: any = {
            address: cellarConfig.cellar.address as `0x${string}`,
            abi: cellarConfig.cellar.abi,
            functionName: "deposit",
            args: [amtInWei, address],
          }

          if (amtInWei > 0) {
            cellarParams.value = amtInWei
          }

          hash = (await safeWriteContract(cellarParams, {
            vaultName: cellarName,
            tokenSymbol: selectedToken?.symbol,
            transactionType: "deposit",
            chainId: cellarConfig.chain.wagmiId,
          })) as string
        } else {
          // ERC20 token deposit
          hash = (await safeWriteContract(
            {
              address: cellarConfig.cellar.address as `0x${string}`,
              abi: cellarConfig.cellar.abi,
              functionName: "deposit",
              args: [amtInWei, address],
            },
            {
              vaultName: cellarName,
              tokenSymbol: selectedToken?.symbol,
              transactionType: "deposit",
              chainId: cellarConfig.chain.wagmiId,
            }
          )) as string
        }
      }

      if (hash) {
        const receipt = await paidClient?.waitForTransactionReceipt({
          hash: hash as `0x${string}`,
        })

        // Show a confirmation toast for BoringVault (e.g., Alpha STETH) deposits
        if (receipt?.status === "success" && cellarConfig.teller) {
          addToast({
            heading: "Deposit Successful",
            body: (
              <Text>
                Your deposit has been completed successfully.
              </Text>
            ),
            status: "success",
            closeHandler: close,
          })
        }

        return [receipt]
      }

      return []
    } catch (error) {
      console.error("Deposit error:", error)

      // Normalize and handle user-rejected errors gracefully to avoid dev overlay
      const errorContext: TransactionErrorContext = {
        vaultName: cellarName,
        tokenSymbol: selectedToken?.symbol,
        transactionType: "deposit",
        chainId: cellarConfig.chain.wagmiId,
      }
      const normalizedError = handleTransactionError(
        error as Error,
        errorContext
      )

      if (normalizedError.type === "USER_REJECTED") {
        const toastConfig = getTransactionErrorToast(
          normalizedError,
          errorContext
        )
        const analyticsData = getTransactionErrorAnalytics(
          normalizedError,
          errorContext
        )

        analytics.track("deposit.rejected", {
          ...baseAnalytics,
          ...analyticsData,
        })

        // Attribution (deposit user rejected)
        try {
          const domain = window.location.hostname
          const pagePath =
            window.location.pathname + window.location.search
          const sessionId =
            localStorage.getItem("somm_session_id") ||
            crypto.randomUUID()
          localStorage.setItem("somm_session_id", sessionId)
          const toAddress = (cellarConfig.teller?.address ||
            cellarConfig.cellar.address) as string
          await sendIngest({
            stage: "error",
            domain,
            pagePath,
            sessionId,
            wallet: (address || "").toLowerCase(),
            chainId: cellarConfig.chain.wagmiId,
            method: "deposit",
            to: toAddress,
            contractMatch: true,
            strategyKey: cellarConfig.teller
              ? "ALPHA_STETH"
              : undefined,
            status: "user_rejected",
            timestampMs: Date.now(),
          })
        } catch {}

        const toastBody = toastConfig.showPopupGuidance ? (
          <Text>
            {toastConfig.body}
            <br />
            Enable popups for MetaMask and retry.
          </Text>
        ) : (
          <Text>{toastConfig.body}</Text>
        )

        addToast({
          heading: toastConfig.heading,
          body: toastBody,
          status: toastConfig.status,
          closeHandler: closeAll,
        })

        // Do not rethrow user-rejected to prevent red runtime overlay
        return []
      }

      // For all other errors, rethrow to be handled by caller
      throw error
    }
  }

  const onSubmit = async (data: any, e: any) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    const tokenSymbol = data?.selectedToken?.symbol
    const depositAmount = data?.depositAmount

    let nativeDeposit = selectedToken?.symbol === "ETH"
    if (!erc20Contract && !nativeDeposit) return

    // For now, assume batch calls are not supported to avoid the getCapabilities issue
    const canDoBatchCall = false

    const allowance = nativeDeposit
      ? Number.MAX_SAFE_INTEGER
      : // For ERC20, check allowance of the selected token to the correct spender
        // BoringVault (Alpha STETH): spender is Teller; Legacy cellar: spender is Cellar
        // @ts-ignore
        await erc20Contract.read.allowance(
          [
            getAddress(address ?? ""),
            getAddress(cellarConfig.cellar.address),
          ],
          { account: address }
        )
    logTxDebug("deposit.allowance", {
      nativeDeposit,
      allowance: nativeDeposit
        ? "MAX_SAFE_INTEGER"
        : String(allowance),
    })

    const amtInWei = parseUnits(
      depositAmount.toFixed(selectedTokenBalance?.decimals ?? 18),
      selectedTokenBalance?.decimals ?? 0
    )
    logTxDebug("deposit.amountParsed", {
      depositAmount,
      decimals: selectedTokenBalance?.decimals,
      amtInWei: String(amtInWei),
    })

    // Send attribution 'request' event (deposit initiated)
    try {
      const domain = window.location.hostname
      const pagePath =
        window.location.pathname + window.location.search
      const sessionId =
        localStorage.getItem("somm_session_id") || crypto.randomUUID()
      localStorage.setItem("somm_session_id", sessionId)
      const toAddress = (cellarConfig.teller?.address ||
        cellarConfig.cellar.address) as string
      await sendIngest({
        stage: "request",
        domain,
        pagePath,
        sessionId,
        wallet: (address || "").toLowerCase(),
        chainId: cellarConfig.chain.wagmiId,
        method: "deposit",
        paramsRedacted: {
          token: data?.selectedToken?.address,
          amountWei: String(amtInWei),
        },
        to: toAddress,
        contractMatch: true,
        strategyKey: cellarConfig.teller ? "ALPHA_STETH" : undefined,
        amount: String(amtInWei),
        status: "started",
        timestampMs: Date.now(),
      })
    } catch {}

    let needsApproval = allowance < amtInWei
    let approval = !needsApproval

    if (needsApproval && !canDoBatchCall && !nativeDeposit) {
      approval = await doApprovalTx(
        amtInWei,
        getAddress(selectedToken!.address),
        getAddress(cellarConfig.cellar.address)
      )
    }

    if (approval || canDoBatchCall) {
      try {
        // Add a small delay to prevent spam filter triggers
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const receipts = await deposit(
          amtInWei,
          data?.selectedToken?.address,
          approval,
          canDoBatchCall,
          nativeDeposit
        )

        // If no receipts, likely user canceled; a toast was already shown by error handler
        if (!receipts || receipts.length === 0) {
          logTxDebug("deposit.no_receipt", {
            reason: "likely user cancel",
          })
          return
        }

        refetch()

        if (receipts?.[0]?.status === "success") {
          logTxDebug("deposit.success", {
            txHash: receipts![0].transactionHash,
          })
          // Attribution (deposit succeeded)
          try {
            const domain = window.location.hostname
            const pagePath =
              window.location.pathname + window.location.search
            const sessionId =
              localStorage.getItem("somm_session_id") ||
              crypto.randomUUID()
            localStorage.setItem("somm_session_id", sessionId)
            const toAddress = (cellarConfig.teller?.address ||
              cellarConfig.cellar.address) as string
            await sendIngest({
              stage: "receipt",
              domain,
              pagePath,
              sessionId,
              wallet: (address || "").toLowerCase(),
              chainId: cellarConfig.chain.wagmiId,
              method: "deposit",
              txHash: receipts![0].transactionHash,
              to: toAddress,
              contractMatch: true,
              strategyKey: cellarConfig.teller
                ? "ALPHA_STETH"
                : undefined,
              amount: String(
                parseUnits(
                  depositAmount.toFixed(
                    selectedTokenBalance?.decimals ?? 18
                  ),
                  selectedTokenBalance?.decimals ?? 0
                )
              ),
              blockNumber: Number(
                (receipts![0] as any)?.blockNumber ?? 0
              ),
              blockHash: (receipts![0] as any)?.blockHash,
              status: "success",
              token:
                tokenSymbol ||
                (nativeDeposit ? "ETH" : data?.selectedToken?.symbol),
              decimals: selectedTokenBalance?.decimals ?? 18,
              timestampMs: Date.now(),
            })
          } catch {}
          analytics.track("deposit.succeeded", {
            ...baseAnalytics,
            stable: tokenSymbol,
            value: depositAmount,
            transaction_hash: receipts![0].transactionHash,
          })

          update({
            heading: cellarName + " Cellar Deposit",
            body: (
              <>
                <Text>Deposit Success</Text>
                <Link
                  display="flex"
                  alignItems="center"
                  href={`${cellarConfig.chain.blockExplorer.url}/tx/${
                    receipts![0].transactionHash
                  }`}
                  isExternal
                  textDecor="underline"
                >
                  <Text as="span">{`View on ${cellarConfig.chain.blockExplorer.name}`}</Text>
                  <ExternalLinkIcon ml={2} />
                </Link>
                <Text
                  onClick={() => {
                    if (!importToken.isPending) {
                      console.log(
                        "Importing token with address:",
                        cellarAddress
                      )
                      console.log(
                        "Importing token with image:",
                        `${window.origin}${cellarConfig.lpToken.imagePath}`
                      )
                      importToken.mutate({
                        address: cellarAddress,
                        chain: cellarConfig.chain.id,
                        imageUrl: `${window.origin}${cellarConfig.lpToken.imagePath}`,
                      })
                    }
                  }}
                  textDecor="underline"
                  as="button"
                  disabled={importToken.isPending}
                >
                  {importToken.isPending
                    ? "Importing..."
                    : "Import tokens to wallet"}
                </Text>
                {waitTime(cellarConfig) !== null && (
                  <Text textAlign="center">
                    Please wait {waitTime(cellarConfig)} after the
                    deposit to Withdraw or Bond
                  </Text>
                )}
              </>
            ),
            status: "success",
            closeHandler: closeAll,
            duration: null, // toast won't close until user presses close button
          })
        }

        const isPopUpEnable =
          cellarData.popUpTitle && cellarData.popUpDescription

        if (!notifyModal?.isOpen) {
          analytics.track(`${currentStrategies}-notify.modal-opened`)
        }
        if (isPopUpEnable) {
          props.onClose()
          //@ts-ignore
          notifyModal?.onOpen()
        }
      } catch (e) {
        const error = e as Error
        console.error("Deposit error:", error)

        // Use centralized error handling
        const errorContext: TransactionErrorContext = {
          vaultName: cellarName,
          tokenSymbol,
          transactionType: "deposit",
          value: depositAmount,
          chainId: cellarConfig.chain.wagmiId,
        }

        const normalizedError = handleTransactionError(
          error,
          errorContext
        )
        const toastConfig = getTransactionErrorToast(
          normalizedError,
          errorContext
        )
        const analyticsData = getTransactionErrorAnalytics(
          normalizedError,
          errorContext
        )

        // Track analytics
        analytics.track("deposit.rejected", {
          ...baseAnalytics,
          ...analyticsData,
        })

        // Attribution (deposit error)
        try {
          const domain = window.location.hostname
          const pagePath =
            window.location.pathname + window.location.search
          const sessionId =
            localStorage.getItem("somm_session_id") ||
            crypto.randomUUID()
          localStorage.setItem("somm_session_id", sessionId)
          const toAddress = (cellarConfig.teller?.address ||
            cellarConfig.cellar.address) as string
          await sendIngest({
            stage: "error",
            domain,
            pagePath,
            sessionId,
            wallet: (address || "").toLowerCase(),
            chainId: cellarConfig.chain.wagmiId,
            method: "deposit",
            to: toAddress,
            contractMatch: true,
            strategyKey: cellarConfig.teller
              ? "ALPHA_STETH"
              : undefined,
            status: (normalizedError.type || "error").toLowerCase(),
            timestampMs: Date.now(),
          })
        } catch {}

        // Show toast with popup guidance if needed
        const toastBody = toastConfig.showPopupGuidance ? (
          <Text>
            {toastConfig.body}
            <br />
            Enable popups for MetaMask and retry.
          </Text>
        ) : (
          <Text>{toastConfig.body}</Text>
        )

        addToast({
          heading: toastConfig.heading,
          body: toastBody,
          status: toastConfig.status,
          closeHandler: closeAll,
        })

        console.warn("failed to deposit", e)
      }
    }
  }

  const onError = async (errors: any, e: any) => {
    // try and handle basic cases
    // gasFailure
    // onChain assert
    addToast({
      heading: cellarName + " Cellar Deposit",
      body: <Text>Deposit Failed</Text>,
      status: "error",
      closeHandler: closeAll,
    })
  }

  const currentAsset = getCurrentAsset(
    tokenConfig,
    cellarConfig.chain.id,
    selectedToken?.address
  )

  const displayAsset =
    id === config.CONTRACT.ALPHA_STETH.SLUG
      ? cellarConfig.baseAsset
      : currentAsset

  // Move active asset to top of token list.
  useEffect(() => {
    if (currentAsset === undefined) return

    const indexOfActiveAsset = depositAssetTokenConfig.findIndex(
      (token) => token === currentAsset
    )

    depositAssetTokenConfig.splice(
      0,
      0,
      depositAssetTokenConfig.splice(indexOfActiveAsset, 1)[0]
    )
  }, [selectedToken, currentAsset])

  const strategyMessages: Record<string, () => JSX.Element> = {
    "Real Yield ETH": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "real yield eth arb": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />
          - 1 steth=1 weth is not hard coded in Aave on Arbitrum
          unlike Ethereum mainnet. There is a depeg risk for steth.
          <br /> - Borrow rates on Aave have been far more volatile
          than borrow rates on Ethereum on Ethereum .
          <br /> - This vault uses leverage, which means there is
          liquidation risk.
          <br />
          <br /> - This vault does liquidity provision which can
          result in impermanent loss.
        </Text>
      </>
    ),
    "real yield eth opt": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br /> - This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br /> - This vault does liquidity provision which can
          result in impermanent loss.
        </Text>
      </>
    ),
    "real yield eth scroll": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br /> - This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br /> - This vault does liquidity provision which can
          result in impermanent loss.
        </Text>
      </>
    ),
    "Real Yield USD": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized and
          centralized stablecoins, both of which can experience depeg
          events.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "real yield usd arb": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "Real Yield BTC": () => (
      <>
        <Link
          href={"https://app.rhino.fi/invest/YIELDBTC/supply"}
          isExternal
          role="group"
          textAlign="center"
        >
          <Text as="span">
            Buy and sell gassless on rhino.fi &nbsp;
          </Text>
          <Icon as={FaExternalLinkAlt} color="purple.base" />
        </Link>
        <br />
        <br />
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "ETH Trend Growth": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "Turbo GHO": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized and
          centralized stablecoins, both of which can experience depeg
          events.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "Turbo SWETH": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />
          - This vault has exposure to swETH, an LST that is not
          redeemable until Q1 2024, which makes this LST more
          susceptible to depegs than its redeemable counterparts.
          <br />
          <br />- Because withdrawals can only be facilitated based on
          the available ETH-swETH liquidity in the market, it is
          possible to receive swETH upon withdrawal even if you
          deposited ETH.
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    Fraximal: () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is mainly comprised of decentralized
          stablecoins, which can experience depeg events.
        </Text>
      </>
    ),
    "Real Yield LINK": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "ETH BTC Trend": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "ETH BTC Momentum": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "DeFi Stars": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault is denominated in USDC but exposes you to
          volatile crypto assets, which carry a risk of potential
          loss.
        </Text>
      </>
    ),
    "Real Yield ENS": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Real Yield UNI": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Real Yield SNX": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Real Yield 1Inch": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage which presents a risk for
          the vault to be liquidated. Although there are safeguards in
          place to help mitigate this, the liquidation risk is not
          eliminated.
        </Text>
      </>
    ),
    "Morpho ETH": () => (
      <>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault uses leverage, which means there is
          liquidation risk.
        </Text>
      </>
    ),
    "Turbo SOMM": () => (
      <>
        <Text as="span" style={{ textAlign: "center" }}>
          Bridge your SOMM tokens to Ethereum via{" "}
          <Link
            href="https://app.sommelier.finance/bridge"
            isExternal
            textDecor="underline"
          >
            Somm bridge
          </Link>
        </Text>
        <Text as="span">
          All Somm vaults contain smart contract risk and varying
          degrees of economic risk. Please take note of the following
          risks; however, this list is not exhaustive, and there may
          be additional risks:
          <br />
          <br />- This vault does liquidity provision which can result
          in impermanent loss.
        </Text>
      </>
    ),
    "Turbo eETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    "Turbo STETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    turboSTETHstETHDeposit: () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    "Turbo divETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault will take exposure to divETH, an emerging LST,
        which means that it may be more susceptible to depeg risk than
        some of its more established counterparts.
        <br />
        <br />- This vault does liquidity provision which can result
        in impermanent loss.
      </Text>
    ),
    "Turbo ETHx": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault has exposure to ETHx, an emerging LST, which
        means that it is more susceptible to depegs than its more
        established counterparts.
        <br />
        <br />- This vault may use leverge in the future, which means
        there is liquidation risk.
      </Text>
    ),
    "Turbo eETHV2": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault does liquidity provision which can result in
        impermanent loss.
        <br />
        <br />- This vault uses leverage, which means there is
        liquidation risk.
      </Text>
    ),
    "Turbo rsETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault does liquidity provision which can result in
        impermanent loss.
        <br />
        <br />- This vault uses leverage, which means there is
        liquidation risk.
      </Text>
    ),
    "Turbo ezETH": () => (
      <Text as="span">
        All Somm vaults contain smart contract risk and varying
        degrees of economic risk. Please take note of the following
        risks; however, this list is not exhaustive, and there may be
        additional risks:
        <br />
        <br />
        - This vault does liquidity provision which can result in
        impermanent loss.
        <br />
        <br />- This vault uses leverage, which means there is
        liquidation risk.
      </Text>
    ),
  }
  return (
    <>
      <VStack pb={10} spacing={6} align="stretch">
        <VStack align="stretch">
          {/* <CardHeading>Strategy details</CardHeading> */}
          <HStack justify="space-between">
            <Text as="span">Vault</Text>
            <Text as="span">{cellarName}</Text>
          </HStack>
          <HStack justify="space-between">
            <Text as="span">
              {id === config.CONTRACT.ALPHA_STETH.SLUG
                ? "Base asset"
                : "Accounting Asset"}
            </Text>
            {isLoading ? (
              <Spinner size="xs" />
            ) : (
              <HStack spacing={1}>
                <Avatar
                  boxSize={7}
                  src={displayAsset?.src}
                  name={displayAsset?.alt}
                  borderWidth={2}
                  borderColor="surface.bg"
                  bg="surface.bg"
                />
                <Text as="span">{displayAsset?.symbol}</Text>
              </HStack>
            )}
          </HStack>
        </VStack>
      </VStack>
      <FormProvider {...methods}>
        <VStack
          as="form"
          spacing={5}
          align="stretch"
          onSubmit={handleSubmit(onSubmit, onError)}
        >
          {/* Alpha stETH: Net APY metric + tooltip */}
          {isAlpha && (
            <VStack spacing={1} align="center">
              <Text as="span" fontSize="21px" fontWeight="bold">
                {isLoading ? <Spinner /> : netApy ?? "--"}
              </Text>
              <Tooltip
                hasArrow
                placement="top"
                label={
                  <VStack align="start" spacing={1} maxW="280px">
                    <Text fontWeight="semibold">{alphaStethI18n.tooltipTitle}</Text>
                    <Text>{alphaStethI18n.tooltipBody}</Text>
                    <Text as="a" href={alphaStethI18n.tooltipLinkHref} target="_blank" rel="noopener noreferrer" textDecor="underline">
                      {alphaStethI18n.tooltipLinkText}
                    </Text>
                  </VStack>
                }
                bg="surface.bg"
                color="neutral.300"
              >
                <HStack spacing={1} align="center">
                  <CardHeading>{alphaStethI18n.netApyLabel}</CardHeading>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
              <Text fontSize="xs" color="neutral.400" textAlign="center" maxW="280px">
                {alphaStethI18n.footnote}
              </Text>
            </VStack>
          )}
          <FormControl isInvalid={isError as boolean | undefined}>
            <ModalMenu
              depositTokens={depositTokens}
              setSelectedToken={setSelectedToken}
              activeAsset={selectedToken?.address}
              selectedTokenBalance={selectedTokenBalance}
              isDisabled={isSubmitting}
            />
            <FormErrorMessage color="energyYellow">
              <Icon
                p={0.5}
                mr={1}
                color="surface.bg"
                bg="red.base"
                borderRadius="50%"
                as={AiOutlineInfo}
              />
              {errors.depositAmount?.message ??
                errors.slippage?.message}
            </FormErrorMessage>
          </FormControl>
          {selectedToken?.symbol !== cellarConfig.baseAsset.symbol ? (
            <>
              {id !== config.CONTRACT.ALPHA_STETH.SLUG && (
                <>
                  <CardHeading paddingTop="2em">
                    Transaction details
                  </CardHeading>
                  <HStack justify="space-between">
                    <HStack spacing={1} align="center">
                      <Tooltip
                        hasArrow
                        label="The percentage fee you will pay to deposit into the vault. This asset is deposited directly into the vault;
                  however, it may incur a small fee due to the
                  management of positions at the smart contract level."
                        bg="surface.bg"
                        color="neutral.300"
                        textAlign="center"
                      >
                        <HStack spacing={1} align="center">
                          <CardHeading fontSize="small">
                            Alternative Deposit Asset Fee
                          </CardHeading>
                          <InformationIcon
                            color="neutral.300"
                            boxSize={3}
                          />
                        </HStack>
                      </Tooltip>
                    </HStack>
                    {cellarData.depositTokens.list.includes(
                      selectedToken?.symbol || ""
                    ) ? (
                      <>
                        {isDepositFeeLoading ? (
                          <Spinner size="md" paddingRight={"1em"} />
                        ) : (
                          <Tooltip
                            hasArrow
                            label={
                              depositFee === 0
                                ? "No deposit fee."
                                : null
                            }
                            bg="surface.bg"
                            color="neutral.300"
                            textAlign="center"
                          >
                            <HStack pr={2}>
                              {depositFee === 0 ? (
                                <GreenCheckCircleIcon />
                              ) : null}
                              <Text fontFamily={"inherit"}>
                                {depositFee === 0
                                  ? "None"
                                  : `${depositFee}%`}
                              </Text>
                            </HStack>
                          </Tooltip>
                        )}
                      </>
                    ) : null}
                  </HStack>
                </>
              )}
              <HStack
                justifyContent={"center"}
                p={3}
                spacing={4}
                align="flex-start"
                backgroundColor="purple.dark"
                border="2px solid"
                borderRadius={16}
                borderColor="purple.base"
              >
                {selectedToken?.symbol !==
                cellarConfig.baseAsset.symbol ? (
                  <Text
                    fontFamily={"inherit"}
                    fontWeight={
                      id === config.CONTRACT.ALPHA_STETH.SLUG
                        ? "normal"
                        : "bold"
                    }
                    textAlign="center"
                  >
                    {id === config.CONTRACT.ALPHA_STETH.SLUG
                      ? "Deposited funds can’t be withdrawn for 24 hours after deposit.\nWithdrawals are only in wstETH, regardless of deposited asset(s)."
                      : "If you deposit an asset other than the accounting asset, there is no guarantee that you will receive the same asset upon withdrawal."}
                  </Text>
                ) : null}
              </HStack>
            </>
          ) : null}
          {needsSwitch && (
            <BaseButton
              type="button"
              isDisabled={isSubmitting}
              onClick={async () => {
                try {
                  if (desiredChainId) {
                    await switchChainAsync?.({
                      chainId: desiredChainId,
                    })
                  }
                } catch {}
              }}
              fontSize={18}
              py={4}
              px={8}
            >
              Switch network to proceed
            </BaseButton>
          )}
          <BaseButton
            type="submit"
            isDisabled={
              isDisabled ||
              (selectedToken?.symbol !==
                cellarConfig.baseAsset.symbol &&
                !cellarData.depositTokens.list.includes(
                  selectedToken?.symbol || ""
                ))
            }
            isLoading={isSubmitting}
            fontSize={21}
            py={8}
            px={12}
          >
            {isSubmitting ? "Waiting for wallet…" : "Submit"}
          </BaseButton>
          {insufficientBalance && (
            <Text color="red.base" fontSize="sm">
              Insufficient balance for the entered amount.
            </Text>
          )}
          {strategyMessages[currentStrategies] ? (
            strategyMessages[currentStrategies]()
          ) : (
            <></>
          )}
        </VStack>
      </FormProvider>
    </>
  )
}

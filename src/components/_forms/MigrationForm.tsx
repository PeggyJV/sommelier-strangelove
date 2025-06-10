import React, { useEffect } from "react"
import {
  FormControl,
  FormErrorMessage,
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
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, usePublicClient } from "wagmi"
import {
  getCallsStatus,
  getCapabilities,
  sendCalls,
} from "@wagmi/core"
import { toEther } from "utils/formatCurrency"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useGeo } from "context/geoContext"
import { waitTime } from "data/uiConfig"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { fetchCellarRedeemableReserves } from "queries/get-cellar-redeemable-asssets"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { erc20Abi, getAddress, getContract, parseUnits } from "viem"
import { wagmiConfig } from "context/wagmiContext"
import { ExternalLinkIcon } from "components/_icons"

interface FormValues {
  withdrawAmount: number
}

interface MigrationFormProps {
  onClose: () => void
}

export const MigrationForm = ({ onClose }: MigrationFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const { id: _id } = useDepositModalStore()

  const { addToast, close, closeAll, update } = useBrandedToast()
  const { address } = useAccount()
  const publicClient = usePublicClient()

  const id = (useRouter().query.id as string) || _id
  const cellarConfig = cellarDataMap[id].config

  const alphaStEth = cellarDataMap["Alpha-stETH"]

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const { cellarSigner, boringVaultLens } = useCreateContracts(
    alphaStEth.config
  )

  const erc20Contract =
    cellarConfig.baseAsset.address &&
    publicClient &&
    getContract({
      address: getAddress(cellarConfig.baseAsset.address),
      abi: erc20Abi,
      client: {
        public: publicClient,
      },
    })

  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken

  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)
  }

  useEffect(() => {
    if (watchWithdrawAmount !== null) {
      analytics.track("withdraw.amount-selected", {
        account: address,
        amount: watchWithdrawAmount,
      })
    }
  }, [watchWithdrawAmount, address])

  const geo = useGeo()
  const onSubmit = async ({ withdrawAmount }: FormValues) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    if (withdrawAmount <= 0 || !erc20Contract) return

    if (!address) {
      addToast({
        heading: "Withdraw Position",
        status: "default",
        body: <Text>Connect Wallet</Text>,
        closeHandler: close,
        duration: null,
      })

      return
    }

    let withdrawalCall
    let approvalCall
    let depositCall
    let batchCalls = []

    const walletCapabilities = await getCapabilities(wagmiConfig)
    const atomicStatus =
      walletCapabilities[cellarConfig.chain.wagmiId]?.atomic?.status

    const canDoBatchCall =
      atomicStatus === "ready" || atomicStatus === "supported"

    if (!canDoBatchCall) {
      addToast({
        heading: "Migration",
        body: <Text>Migration is not supported on this wallet.</Text>,
        status: "error",
        closeHandler: closeAll,
      })
      return
    }

    const amtInWei = parseUnits(
      `${withdrawAmount}`,
      cellarConfig.cellar.decimals
    )

    try {
      // const gasLimitEstimated = await estimateGasLimitWithRetry(
      //   cellarSigner?.estimateGas.redeem,
      //   cellarSigner?.simulate.redeem,
      //   [amtInWei, address, address],
      //   330000,
      //   address
      // )

      // // @ts-ignore
      // const hash = await cellarSigner?.write.redeem(
      //   [amtInWei, address, address],
      //   {
      //     gas: gasLimitEstimated,
      //     account: address,
      //   }
      // )
      withdrawalCall = {
        to: cellarConfig.cellar.address as `0x${string}`,
        abi: cellarConfig.cellar.abi,
        functionName: "redeem",
        args: [amtInWei, address, address],
      }
      batchCalls.push(withdrawalCall)

      // check if we need to swap
      let needToSwap = !alphaStEth.depositTokens.list.includes(
        cellarConfig.baseAsset.symbol
      )

      if (needToSwap) {
        // swap to alphaStEth deposit asset (always stETH?)
      }


      const allowance = await erc20Contract.read.allowance(
        [
          getAddress(address ?? ""),
          getAddress(cellarConfig.cellar.address),
        ],
        { account: address }
      )

      let needsApproval = allowance < amtInWei
      if (needsApproval) {
        approvalCall = {
          to: cellarConfig.baseAsset.address as `0x${string}`,
          abi: erc20Abi,
          functionName: erc20Abi[3].name,
          args: [
            alphaStEth.config.cellar.address as `0x${string}`,
            amtInWei,
          ] as const,
        }
        batchCalls.push(approvalCall)
      }

      // Deposit call to BoringVault

      // @ts-ignore
      const minimumMint = await boringVaultLens?.read.previewDeposit([
        cellarConfig.baseAsset.address,
        amtInWei,
        alphaStEth.config.cellar.address,
        alphaStEth.config.accountant?.address,
      ])

      depositCall = {
        to: cellarSigner?.address as `0x${string}`,
        abi: cellarSigner?.abi!,
        functionName: "deposit",
        args: [cellarConfig.baseAsset.address, amtInWei, minimumMint],
      }
      batchCalls.push(depositCall)

      const { id } = await sendCalls(wagmiConfig, {
        calls: batchCalls,
        chainId: cellarConfig.chain.wagmiId,
        experimental_fallback: true,
      })

      const depositResult = await getCallsStatus(wagmiConfig, {
        id,
      })

      let finalResult = depositResult
      while (finalResult.status === "pending") {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        finalResult = await getCallsStatus(wagmiConfig, {
          id,
        })
      }

      if (finalResult.status === "failure") {
        throw new Error("Batch Deposit failed")
      }

      addToast({
        heading: "Migrating to Alpha stETH",
        status: "default",
        body: <Text>Depositing {cellarConfig.baseAsset.symbol}</Text>,
        isLoading: true,
        closeHandler: close,
        duration: null,
      })

      refetch()

      if (finalResult.receipts?.[0]?.status === "success") {

        update({
          heading: "Alpha stETH Cellar Deposit",
          body: (
            <>
              <Text>Deposit Success</Text>
              <Link
                display="flex"
                alignItems="center"
                href={`${
                  alphaStEth.config.chain.blockExplorer.url
                }/tx/${finalResult.receipts![0].transactionHash}`}
                isExternal
                textDecor="underline"
              >
                <Text as="span">{`View on ${alphaStEth.config.chain.blockExplorer.name}`}</Text>
                <ExternalLinkIcon ml={2} />
              </Link>
            </>
          ),
          status: "success",
          closeHandler: closeAll,
          duration: null,
        })
      }

    } catch (e) {
      const error = e as Error

      // Get Redeemable Assets
      const redeemableAssets: number = parseInt(
        await fetchCellarRedeemableReserves(id)
      )

      // previewRedeem on the shares the user is attempting to withdraw
      // Only get previewRedeem on 1 share to optimize caching and do relevant math below
      const previewRedeem: number = parseInt(
        await fetchCellarPreviewRedeem(
          id,
          BigInt(10 ** cellarConfig.cellar.decimals)
        )
      )
      const redeemAmt: number = Math.floor(
        previewRedeem * watchWithdrawAmount
      )
      const redeemingMoreThanAvailible = redeemAmt > redeemableAssets

      /*
      console.log("---")
      console.log("Reedemable assets: ", redeemableAssets)
      console.log("Withdraw amount: ", watchWithdrawAmount)
      console.log("Preview redeem: ", previewRedeem)
      console.log("Redeeming amt: ", redeemAmt)
      console.log("Redeeming more than availible: ", redeemingMoreThanAvailible)
      console.log("---")
      */

      // Check if attempting to withdraw more than availible
      if (redeemingMoreThanAvailible) {
        // TODO: Open a modal with information about the withdraw queue
      } else {
        if (error.message === "GAS_LIMIT_ERROR") {
          addToast({
            heading: "Transaction not submitted",
            body: (
              <Text>
                Your transaction has failed, if it does not work after
                waiting some time and retrying please send a message
                in our{" "}
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
            heading: "Withdraw",
            body: <Text>Withdraw Cancelled</Text>,
            status: "error",
            closeHandler: closeAll,
          })
        }

        refetch()
        setValue("withdrawAmount", 0)
      }
    }
  }

  return (
    <>
      <VStack
        as="form"
        spacing={8}
        align="stretch"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl isInvalid={isError as boolean | undefined}>
          <Stack spacing={2}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              Enter Amount
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
          </Stack>
        </FormControl>
        <Stack>
          <Text
            fontSize="sm"
            fontWeight="semibold"
            color="neutral.400"
          >
            Transaction Details
          </Text>
          <Stack>
            <HStack
              alignItems="flex-start"
              justifyContent="space-between"
            >
              <Text color="neutral.300">Vault</Text>
              <Stack>
                <Text>{cellarDataMap[id].name}</Text>
              </Stack>
            </HStack>
          </Stack>
        </Stack>

        <BaseButton
          type="submit"
          isDisabled={isDisabled}
          isLoading={isSubmitting}
          fontSize={21}
          py={6}
          px={12}
        >
          Submit
        </BaseButton>
        {waitTime(cellarConfig) !== null && (
          <Text textAlign="center">
            Please wait {waitTime(cellarConfig)} after the deposit to
            Withdraw
          </Text>
        )}
      </VStack>
    </>
  )
}

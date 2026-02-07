import React, { useEffect, useState } from "react"
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { useHandleTransaction } from "hooks/web3"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { CellarKey } from "data/types"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalance } from "data/hooks/useUserBalance"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { waitTime } from "data/uiConfig"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { fetchCellarRedeemableReserves } from "queries/get-cellar-redeemable-asssets"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { WithdrawQueueButton } from "components/_buttons/WithdrawQueueButton"
import { parseUnits } from "viem"
import {
  handleTransactionError,
  getTransactionErrorToast,
  getTransactionErrorAnalytics,
  type TransactionErrorContext,
} from "utils/handleTransactionError"
import { config } from "utils/config"
import {
  fetchNeutronVaultLiquidity,
  calculateMaxWithdrawableShares,
  canFulfillWithdrawal,
} from "queries/get-neutron-vault-liquidity"

interface FormValues {
  withdrawAmount: number
}

interface WithdrawFormProps {
  onClose: () => void
}

export const WithdrawForm = ({ onClose }: WithdrawFormProps) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const { id: _id } = useDepositModalStore()

  const { addToast, close, closeAll } = useBrandedToast()
  const { address } = useAccount()

  const openWithdrawQueueModal = () =>
    setIsWithdrawQueueModalOpen(true)
  const closeWithdrawQueueModal = () => {
    setIsWithdrawQueueModalOpen(false)
    onClose()
  }

  const id = (useRouter().query.id as string) || _id
  const cellarConfig = cellarDataMap[id].config

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const { cellarSigner } = useCreateContracts(cellarConfig)

  const [isWithdrawQueueModalOpen, setIsWithdrawQueueModalOpen] =
    useState(false)
  const [isAsyncWithdrawModalOpen, setIsAsyncWithdrawModalOpen] =
    useState(false)

  // Check if this is a Neutron cross-chain vault (requires async withdrawal)
  const isNeutronVault = cellarConfig.cellar.key === CellarKey.NEUTRON_CROSS_CHAIN

  // Pilot guardrail: Track ETH-side liquidity for Neutron vault
  const [neutronLiquidity, setNeutronLiquidity] = useState<{
    localBalance: bigint
    totalSupply: bigint
    totalNAV: bigint
    maxWithdrawableShares: bigint
    isLoading: boolean
    error: string | null
  }>({
    localBalance: 0n,
    totalSupply: 0n,
    totalNAV: 0n,
    maxWithdrawableShares: 0n,
    isLoading: true,
    error: null,
  })

  // Pilot guardrail: Fetch liquidity on mount for Neutron vault
  useEffect(() => {
    if (!isNeutronVault) return

    const fetchLiquidity = async () => {
      try {
        const data = await fetchNeutronVaultLiquidity()
        const maxShares = calculateMaxWithdrawableShares(
          data.localBalance,
          data.totalSupply,
          data.totalNAV
        )
        setNeutronLiquidity({
          ...data,
          maxWithdrawableShares: maxShares,
          isLoading: false,
          error: null,
        })
      } catch (err) {
        setNeutronLiquidity((prev) => ({
          ...prev,
          isLoading: false,
          error: "Failed to fetch liquidity",
        }))
      }
    }

    fetchLiquidity()
    // Refresh every 30 seconds
    const interval = setInterval(fetchLiquidity, 30000)
    return () => clearInterval(interval)
  }, [isNeutronVault])

  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken

  const { doHandleTransaction } = useHandleTransaction()

  const watchWithdrawAmount = watch("withdrawAmount")

  // Pilot guardrail: Check if withdrawal exceeds available liquidity (Neutron vault only)
  const withdrawAmountInWei = !isNaN(watchWithdrawAmount) && watchWithdrawAmount > 0
    ? parseUnits(`${watchWithdrawAmount}`, cellarConfig.cellar.decimals)
    : 0n

  const liquidityCheck = isNeutronVault && !neutronLiquidity.isLoading
    ? canFulfillWithdrawal(
        withdrawAmountInWei,
        neutronLiquidity.localBalance,
        neutronLiquidity.totalSupply,
        neutronLiquidity.totalNAV
      )
    : { canFulfill: true, requiredAssets: 0n, availableAssets: 0n }

  // Pilot guardrail: HARD BLOCK withdrawal if insufficient liquidity
  const isInsufficientLiquidity = isNeutronVault &&
    !neutronLiquidity.isLoading &&
    watchWithdrawAmount > 0 &&
    !liquidityCheck.canFulfill

  const isDisabled =
    isNaN(watchWithdrawAmount) ||
    watchWithdrawAmount <= 0 ||
    isInsufficientLiquidity || // Pilot guardrail: Block if insufficient liquidity
    (isNeutronVault && neutronLiquidity.isLoading)
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
    if (withdrawAmount <= 0) return

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

    const analyticsData = {
      account: address,
      amount: withdrawAmount,
    }

    const amtInWei = parseUnits(
      `${withdrawAmount}`,
      cellarConfig.cellar.decimals
    )

    try {
      // Alpha STETH: pre-check redeemable liquidity to avoid failing redeem tx
      if (id === config.CONTRACT.ALPHA_STETH.SLUG) {
        const redeemableAssets: number = parseInt(
          await fetchCellarRedeemableReserves(id)
        )
        const previewRedeem: number = parseInt(
          await fetchCellarPreviewRedeem(
            id,
            BigInt(10 ** cellarConfig.cellar.decimals)
          )
        )
        const redeemAmt: number = Math.floor(
          previewRedeem * watchWithdrawAmount
        )
        if (redeemAmt > redeemableAssets) {
          openWithdrawQueueModal()
          return
        }
      }

      let hash: `0x${string}` | undefined

      // Neutron cross-chain vault uses async withdrawal (requestWithdraw)
      if (isNeutronVault) {
        const preferredAsset = cellarConfig.baseAsset.address as `0x${string}`
        const minAssetsOut = BigInt(0) // Allow any amount (slippage handled by NAV)

        const gasLimitEstimated = await estimateGasLimitWithRetry(
          cellarSigner?.estimateGas.requestWithdraw,
          cellarSigner?.simulate.requestWithdraw,
          [amtInWei, preferredAsset, minAssetsOut],
          400000,
          address
        )

        // @ts-ignore
        hash = await cellarSigner?.write.requestWithdraw(
          [amtInWei, preferredAsset, minAssetsOut],
          {
            gas: gasLimitEstimated,
            account: address,
          }
        )
      } else {
        // Standard ERC-4626 redeem
        const gasLimitEstimated = await estimateGasLimitWithRetry(
          cellarSigner?.estimateGas.redeem,
          cellarSigner?.simulate.redeem,
          [amtInWei, address, address],
          330000,
          address
        )

        // @ts-ignore
        hash = await cellarSigner?.write.redeem(
          [amtInWei, address, address],
          {
            gas: gasLimitEstimated,
            account: address,
          }
        )
      }

      const onSuccess = () => {
        analytics.track("withdraw.succeeded", analyticsData)
        if (isNeutronVault) {
          // Show async withdrawal info modal
          setIsAsyncWithdrawModalOpen(true)
        } else {
          onClose() // Close modal after successful withdraw.
        }
      }

      const onError = (error: Error) => {
        analytics.track("withdraw.failed", {
          ...analyticsData,
          error: error.name,
          message: error.message,
        })
      }

      await doHandleTransaction({
        cellarConfig,
        hash,
        onSuccess,
        onError,
      })
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
        // Open a modal with information about the withdraw queue
        openWithdrawQueueModal()
      } else {
        // Use centralized error handling
        const errorContext: TransactionErrorContext = {
          vaultName: cellarDataMap[id].name,
          transactionType: "withdraw",
          value: withdrawAmount,
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
        analytics.track("withdraw.rejected", {
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
          closeHandler: closeAll,
        })

        refetch()
        setValue("withdrawAmount", 0)
      }
    }
  }

  return (
    <>
      {/* Async Withdrawal Success Modal (Neutron cross-chain) */}
      <Modal
        isOpen={isAsyncWithdrawModalOpen}
        onClose={() => {
          setIsAsyncWithdrawModalOpen(false)
          onClose()
        }}
      >
        <ModalOverlay />
        <ModalContent
          p={2}
          w="auto"
          zIndex={401}
          borderWidth={1}
          borderColor="purple.dark"
          borderRadius={12}
          bg="surface.bg"
          fontWeight="semibold"
          _focus={{
            outline: "unset",
            outlineOffset: "unset",
            boxShadow: "unset",
          }}
        >
          <ModalHeader>Withdrawal Request Submitted</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} pb={4}>
              <Text textAlign="center" fontWeight="normal">
                Your withdrawal request has been submitted successfully.
              </Text>
              <VStack spacing={2} bg="surface.tertiary" p={4} borderRadius={8} w="100%">
                <Text fontWeight="bold" color="neutral.300" fontSize="sm">
                  What happens next?
                </Text>
                <Text textAlign="center" fontWeight="normal" fontSize="sm">
                  1. Bridge operator bridges funds from Neutron (~16 min)
                </Text>
                <Text textAlign="center" fontWeight="normal" fontSize="sm">
                  2. Operator fulfills your withdrawal request
                </Text>
                <Text textAlign="center" fontWeight="normal" fontSize="sm">
                  3. WBTC is transferred to your wallet
                </Text>
              </VStack>
              <Text textAlign="center" fontWeight="normal" fontSize="xs" color="neutral.400">
                Cross-chain withdrawals typically complete within 30 minutes.
                Requests expire after 7 days if not fulfilled.
              </Text>
              <Button
                colorScheme="purple"
                onClick={() => {
                  setIsAsyncWithdrawModalOpen(false)
                  onClose()
                }}
              >
                Close
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Withdraw Queue Modal (insufficient liquidity) */}
      <Modal
        isOpen={isWithdrawQueueModalOpen}
        onClose={closeWithdrawQueueModal}
      >
        <ModalOverlay />
        <ModalContent
          p={2}
          w="auto"
          zIndex={401}
          borderWidth={1}
          borderColor="purple.dark"
          borderRadius={12}
          bg="surface.bg"
          fontWeight="semibold"
          _focus={{
            outline: "unset",
            outlineOffset: "unset",
            boxShadow: "unset",
          }}
        >
          <ModalHeader>Transaction not submitted</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={8}>
              <Text textAlign={"center"}>
                You are attempting to withdraw beyond the liquid
                reserve. Please submit a withdraw request via the
                withdraw queue.
              </Text>
              <WithdrawQueueButton
                size="md"
                chain={cellarConfig.chain}
                buttonLabel="Submit Withdraw Request"
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
      <VStack
        as="form"
        spacing={8}
        align="stretch"
        onSubmit={handleSubmit(onSubmit)}
        hidden={isWithdrawQueueModalOpen}
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
            <TransactionDetailItem
              title="Vault"
              value={<Text>{cellarDataMap[id].name}</Text>}
            />
            {/* Pilot guardrail: Show available liquidity for Neutron vault */}
            {isNeutronVault && (
              <TransactionDetailItem
                title="Available Liquidity"
                value={
                  neutronLiquidity.isLoading ? (
                    <Spinner size="xs" />
                  ) : (
                    <Text color={isInsufficientLiquidity ? "red.400" : "inherit"}>
                      {(Number(neutronLiquidity.localBalance) / 1e8).toFixed(8)} WBTC
                    </Text>
                  )
                }
              />
            )}
          </Stack>
        </Stack>

        {/* Pilot guardrail: Show error if insufficient liquidity */}
        {isInsufficientLiquidity && (
          <VStack
            spacing={2}
            bg="red.900"
            border="1px solid"
            borderColor="red.500"
            p={3}
            borderRadius={8}
          >
            <HStack>
              <Icon as={AiOutlineInfo} color="red.400" />
              <Text color="red.400" fontWeight="bold" fontSize="sm">
                Insufficient liquidity to fulfill withdrawal
              </Text>
            </HStack>
            <Text textAlign="center" fontSize="xs" color="red.300">
              Requested: {(Number(liquidityCheck.requiredAssets) / 1e8).toFixed(8)} WBTC
              {" | "}
              Available: {(Number(liquidityCheck.availableAssets) / 1e8).toFixed(8)} WBTC
            </Text>
            <Text textAlign="center" fontSize="xs" color="neutral.400">
              Try a smaller amount or wait for bridge operator to add liquidity.
            </Text>
          </VStack>
        )}

        <BaseButton
          type="submit"
          isDisabled={isDisabled}
          isLoading={isSubmitting}
          fontSize={21}
          py={6}
          px={12}
        >
          {isNeutronVault ? "Request Withdrawal" : "Submit"}
        </BaseButton>
        {isNeutronVault && (
          <VStack spacing={2} bg="surface.tertiary" p={3} borderRadius={8}>
            <Text textAlign="center" fontSize="xs" color="neutral.300">
              Cross-chain vault: Withdrawals are async and require bridge operator action.
              Typically completes within ~30 minutes.
            </Text>
          </VStack>
        )}
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

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
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody
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
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalance } from "data/hooks/useUserBalance"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { waitTime } from "data/uiConfig"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { fetchCellarRedeemableReserves } from "queries/get-cellar-redeemable-asssets"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { WithdrawQueueButton } from "components/_buttons/WithdrawQueueButton"
import { parseUnits } from "viem"

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

  const [isWithdrawQueueModalOpen, setIsWithdrawQueueModalOpen] =
    useState(false)
  const openWithdrawQueueModal = () =>
    setIsWithdrawQueueModalOpen(true)
  const closeWithdrawQueueModal = () =>
    setIsWithdrawQueueModalOpen(false)

  const id = (useRouter().query.id as string) || _id
  const cellarConfig = cellarDataMap[id].config

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const { data: strategyData } = useStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const tokenPrice = strategyData?.tokenPrice

  const { cellarSigner } = useCreateContracts(cellarConfig)

  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken

  const { doHandleTransaction } = useHandleTransaction()

  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)

    // analytics.track("withdraw.max-selected", {
    //   account: address,
    //   amount,
    // })
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

    // analytics.track("withdraw.started", analyticsData)

    const amtInWei = parseUnits(
      `${withdrawAmount}`,
      cellarConfig.cellar.decimals
    )

    try {
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        cellarSigner?.estimateGas.redeem,
        cellarSigner?.simulate.redeem,
        [amtInWei, address, address],
        330000,
        660000
      )


      const tx = await cellarSigner?.write.redeem([
          amtInWei,
          address,
          address
        ],
        {
          gas: gasLimitEstimated,
        }
      )

      const onSuccess = () => {
        analytics.track("withdraw.succeeded", analyticsData)
        onClose() // Close modal after successful withdraw.
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
        ...tx,
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

  function fixed(num: number, fixed: number) {
    fixed = fixed || 0
    fixed = Math.pow(10, fixed)
    return Math.floor(num * fixed) / fixed
  }

  const formatAsset = (num: number, fixed: number) => {
    fixed = fixed || 0
    fixed = Math.pow(10, fixed)
    if (num < 0.01) {
      return ">0.01%"
    }
    return `${Math.floor(num * fixed) / fixed}%`
  }

  return (
    <>
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
                reserve. Please submit a withdraw request via the withdraw queue.
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

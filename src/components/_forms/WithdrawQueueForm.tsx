import React, { useState, useEffect } from "react"
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
  Tooltip,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, usePublicClient, useWalletClient } from "wagmi"
import { getContract, parseUnits } from "viem"
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
import { getAddress } from "viem"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { MaxUint256 } from "utils/bigIntHelpers"
import { useCreateContracts } from "data/hooks/useCreateContracts"

interface FormValues {
  withdrawAmount: number
  deadlineHours: number
  sharePriceDiscountPercent: number
}

interface WithdrawQueueFormProps {
  onClose: () => void
  onSuccessfulWithdraw?: () => void
}

const DEADLINE_HOURS = 288;
const SHARE_PRICE_DISCOUNT_PERCENT = 0;

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

  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()

  const { boringQueue, cellarContract } =
    useCreateContracts(cellarConfig)

  const withdrawQueueContract = (() => {
    if (!publicClient) return
    return boringQueue ?? getContract({
      address: cellarConfig.chain
        .withdrawQueueAddress as `0x${string}`,
      abi: withdrawQueueV0821,
      client: {
        public: publicClient,
        wallet: walletClient,
      },
    })
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

  const [selectedToken, setSelectedToken] = useState<Token>(
    strategyBaseAsset
  )

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

  const isDisabled = isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)
  }

  const geo = useGeo()
  const onSubmit = async ({
    withdrawAmount,
  }: FormValues) => {
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

  const doWithdrawTx = async (selectedToken: Token, withdrawAmtInBaseDenom: bigint) => {
    const currentTime = Math.floor(Date.now() / 1000)
    const deadlineSeconds =
      Math.floor(DEADLINE_HOURS * 60 * 60) + currentTime

    let hash;

    if (boringQueue) {

      let discount =
        cellarConfig.withdrawTokenConfig?.[selectedToken.symbol]
          ?.minDiscount ?? SHARE_PRICE_DISCOUNT_PERCENT

      const deadlineSeconds = DEADLINE_HOURS * 60 * 60

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
    } else {
      const previewRedeem = parseInt(await fetchCellarPreviewRedeem(
        id,
        BigInt(10 ** cellarConfig.cellar.decimals)
      ))

      const sharePriceStandardized =
        previewRedeem / 10 ** cellarConfig.baseAsset.decimals
      const sharePriceWithDiscount =
        sharePriceStandardized *
        ((100 - SHARE_PRICE_DISCOUNT_PERCENT) / 100)
      const sharePriceWithDiscountInBaseDenom = Math.floor(
        sharePriceWithDiscount * 10 ** cellarConfig.baseAsset.decimals
      )
      
      const withdrawTouple = [
        BigInt(deadlineSeconds),
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

    return hash;
  }

  const [isActiveWithdrawRequest, setIsActiveWithdrawRequest] =
    useState(false)

  // Check if a user has an active withdraw request
  const checkWithdrawRequest = async () => {
    console.log("checkWithdrawRequest")
    try {
      if (withdrawQueueContract && address && cellarConfig) {
        const withdrawRequest =
          await withdrawQueueContract?.read.getUserWithdrawRequest([
            address,
            cellarConfig.cellar.address,
          ])

        // Check if it's valid
        const isWithdrawRequestValid =
          (await withdrawQueueContract?.read.isWithdrawRequestValid([
            cellarConfig.cellar.address,
            address,
            withdrawRequest,
          ])) as boolean
        setIsActiveWithdrawRequest(isWithdrawRequestValid)
      } else {
        setIsActiveWithdrawRequest(false)
      }
    } catch (error) {
      console.log(error)
      setIsActiveWithdrawRequest(false)
    }
  }

  useEffect(() => {
    const checkRequest = async () => {
      if (!boringQueue) {
        await checkWithdrawRequest()
      }
    }
    checkRequest()
  }, [boringQueue, withdrawQueueContract, address, cellarConfig])

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
                  You currently have a withdraw request pending in the
                  queue, submitting a new withdraw request will
                  replace your current one.
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
            <HStack justify="space-between">
              <Text as="span">Asset Out</Text>
              {
                <ModalOnlyTokenMenu
                  depositTokens={
                    cellarConfig.boringVault
                      ? Object.keys(
                          cellarDataMap[id].config
                            .withdrawTokenConfig!
                        )
                      : [strategyBaseAsset.symbol]
                  }
                  activeAsset={strategyBaseAsset.address}
                  setSelectedToken={trackedSetSelectedToken}
                  //isDisabled={isSubmitting}
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
            {boringQueue && (
              <>
                <FormControl
                  isInvalid={!!errors.sharePriceDiscountPercent}
                >
                  <HStack justify="space-between">
                    <Tooltip
                      hasArrow
                      placement="top"
                      label={
                        "How much of a discount under the current share price you are willing to accept to fulfill the withdrawal. The higher the discount, the more likely your request will be fulfilled."
                      }
                      bg="surface.bg"
                      color="neutral.300"
                    >
                      <HStack spacing={1} align="center">
                        <Text as="span">Share Price Discount</Text>
                        <InformationIcon
                          color="neutral.300"
                          boxSize={3}
                        />
                      </HStack>
                    </Tooltip>
                    <InputGroup width="25%" alignItems="center">
                      <Input
                        id="sharePrice"
                        variant="unstyled"
                        type="number"
                        step="any"
                        defaultValue={
                          cellarConfig.withdrawTokenConfig?.[
                            selectedToken.symbol
                          ]?.minDiscount
                        }
                        placeholder="0"
                        fontSize="lg"
                        fontWeight={700}
                        textAlign="right"
                        padding={2}
                        borderRadius={16}
                        pr={8}
                        height="2.2em"
                        disabled={true}
                      />
                      <InputRightElement pointerEvents="none">
                        <Text>%</Text>
                      </InputRightElement>
                    </InputGroup>
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
                    {errors.sharePriceDiscountPercent?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.deadlineHours}>
                  <HStack justify="space-between">
                    <Tooltip
                      hasArrow
                      placement="top"
                      label={
                        "How many hours the request will be valid for. If the request is not fulfilled within this duration, it will be cancelled."
                      }
                      bg="surface.bg"
                      color="neutral.300"
                    >
                      <HStack spacing={1} align="center">
                        <Text as="span">Deadline Hours</Text>
                        <InformationIcon
                          color="neutral.300"
                          boxSize={3}
                        />
                      </HStack>
                    </Tooltip>
                    <Input
                      id="deadline"
                      variant="unstyled"
                      pr="2"
                      type="number"
                      step="any"
                      defaultValue={DEADLINE_HOURS}
                      placeholder="0.00"
                      fontSize="lg"
                      fontWeight={700}
                      textAlign="right"
                      width="25%"
                      padding={2}
                      borderRadius={16}
                      height="2.2em"
                      disabled={true}
                    />
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
                    {errors.deadlineHours?.message}
                  </FormErrorMessage>
                </FormControl>
              </>
            )}
          </Stack>
        </Stack>
      </FormProvider>

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

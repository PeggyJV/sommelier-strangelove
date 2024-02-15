import React, { useEffect, useState, VFC } from "react"
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
  ButtonGroup,
  useTheme,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount, useContract, useSigner } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { ethers } from "ethers"
import { useHandleTransaction } from "hooks/web3"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalances } from "data/hooks/useUserBalances"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { Token, tokenConfig } from "data/tokenConfig"
import { ModalOnlyTokenMenu } from "components/_menus/ModalMenu"
import { InformationIcon } from "components/_icons"
import { FAQAccordion } from "components/_cards/StrategyBreakdownCard/FAQAccordion"
import withdrawQueueV0821 from "src/abi/atomic-queue-v0.8.21.json"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { getAddress } from "ethers/lib/utils.js"
import { useWaitForTransaction } from "hooks/wagmi-helper/useWaitForTransactions"
import { queryContract } from "context/rpc_context"
import pricerouterAbi from "src/abi/price-router.json"

interface FormValues {
  withdrawAmount: number
  deadlineHours: number
  sharePriceDiscountPercent: number
  selectedToken: Token
}

interface WithdrawQueueFormProps {
  onClose: () => void
  onSuccessfulWithdraw?: () => void
}

function scientificToDecimalString(num: number) {
  // If the number is in scientific notation, split it into base and exponent
  const sign = Math.sign(num)
  let [base, exponent] = num
    .toString()
    .split("e")
    .map((item) => parseInt(item, 10))

  // Adjust for negative exponent
  if (exponent < 0) {
    let decimalString = Math.abs(base).toString()
    let padding = Math.abs(exponent) - 1
    return (
      (sign < 0 ? "-" : "") +
      "0." +
      "0".repeat(padding) +
      decimalString
    )
  }

  // Handle positive exponent or non-scientific numbers (which won't be split)
  return num.toString()
}

// Define the preset values for the form
// TODO: Consider setting presets per chain
type PresetValueKey = "Low" | "Mid" | "High" | "Custom"
const PRESET_VALUES: Record<
  PresetValueKey,
  { deadlineHours: number; sharePriceDiscountPercent: number }
> = {
  High: { deadlineHours: 12, sharePriceDiscountPercent: 0.15 },
  Mid: { deadlineHours: 24, sharePriceDiscountPercent: 0.05 },
  Low: { deadlineHours: 72, sharePriceDiscountPercent: 0.01 },
  Custom: { deadlineHours: 0, sharePriceDiscountPercent: 0 },
}

export const WithdrawQueueForm: VFC<WithdrawQueueFormProps> = ({
  onClose,
  onSuccessfulWithdraw,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()
  const theme = useTheme()

  const { id: _id } = useDepositModalStore()

  const { addToast, update, close, closeAll } = useBrandedToast()
  const { address } = useAccount()

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

  const { data: signer } = useSigner()
  const withdrawQueueContract = useContract({
    address: cellarConfig.chain.withdrawQueueAddress,
    abi: withdrawQueueV0821,
    signerOrProvider: signer,
  })!

  const cellarContract = useContract({
    address: cellarConfig.cellar.address,
    abi: cellarConfig.cellar.abi,
    signerOrProvider: signer,
  })!

  const [_, wait] = useWaitForTransaction({
    skip: true,
  })

  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken
  let strategyBaseAsset: Token = cellarConfig.baseAsset

  const modalFormMethods = useForm<FormValues>({
    defaultValues: {},
  })

  const [selectedToken, setSelectedToken] = useState<Token | null>(
    null
  )

  function trackedSetSelectedToken(value: Token | null) {
    setSelectedToken(value)
  }

  const [selectedPriority, setSelectedPriority] =
    useState<PresetValueKey>("Mid")

  // Handle the priority selection
  const handleSelect = (value: PresetValueKey) => {
    setSelectedPriority(value)
    if (value !== "Custom") {
      const preset = PRESET_VALUES[value]
      setValue("deadlineHours", preset.deadlineHours)
      setValue(
        "sharePriceDiscountPercent",
        preset.sharePriceDiscountPercent
      )
    }
  }

  useEffect(() => {
    // Initial setting of values based on default selection
    const preset = PRESET_VALUES[selectedPriority]
    setValue("deadlineHours", preset.deadlineHours)
    setValue(
      "sharePriceDiscountPercent",
      preset.sharePriceDiscountPercent
    )
  }, [])

  const { doHandleTransaction } = useHandleTransaction()

  const watchWithdrawAmount = watch("withdrawAmount")
  const watchDeadlineHours = watch("deadlineHours")
  const watchSharePriceDiscountPercent = watch(
    "sharePriceDiscountPercent"
  )

  const isDisabled =
    isNaN(watchWithdrawAmount) ||
    watchWithdrawAmount <= 0 ||
    isNaN(watchDeadlineHours) ||
    watchDeadlineHours <= 0 ||
    isNaN(watchSharePriceDiscountPercent) ||
    watchSharePriceDiscountPercent < 0

  const isError =
    errors.withdrawAmount ||
    errors.deadlineHours ||
    errors.sharePriceDiscountPercent ||
    errors.selectedToken

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)
  }

  const geo = useGeo()
  const onSubmit = async ({
    withdrawAmount,
    deadlineHours,
    sharePriceDiscountPercent,
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

    const withdrawAmtInBaseDenom = ethers.utils.parseUnits(
      `${withdrawAmount}`,
      cellarConfig.cellar.decimals
    )

    // Get approval if needed
    const allowance = await cellarContract.allowance(
      address!,
      getAddress(cellarConfig.chain.withdrawQueueAddress)
    )

    let needsApproval
    try {
      needsApproval = allowance.lt(withdrawAmtInBaseDenom)
    } catch (e) {
      const error = e as Error
      console.error("Invalid Input: ", error.message)
      return
    }

    if (needsApproval) {
      try {
        const { hash } = await cellarContract.approve(
          getAddress(cellarConfig.chain.withdrawQueueAddress),
          ethers.constants.MaxUint256
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
      const currentTime = Math.floor(Date.now() / 1000)
      const deadlineSeconds =
        Math.floor(deadlineHours * 60 * 60) + currentTime

      // Query share price
      const previewRedeem: number = parseInt(
        await fetchCellarPreviewRedeem(
          id,
          BigInt(10 ** cellarConfig.cellar.decimals)
        )
      )

      const sharePriceStandardized =
        previewRedeem / 10 ** cellarConfig.baseAsset.decimals
      const sharePriceWithDiscount =
        sharePriceStandardized *
        ((100 - sharePriceDiscountPercent) / 100)
      let assetRatio = 1

      if (
        selectedToken !== null &&
        selectedToken.address !== cellarConfig.baseAsset.address
      ) {
        // Get asset pice in usd from priceRouter
        let priceRouterContract = await queryContract(
          cellarConfig.chain.priceRouterAddress,
          pricerouterAbi,
          cellarConfig.chain
        )

        if (!priceRouterContract) {
          console.error(
            "No price router contract found on chain: " +
              cellarConfig.chain.id
          )
          throw new Error(
            "No price router contract found on chain: " +
              cellarConfig.chain.id
          )
        }

        const basePrice = await priceRouterContract.getPriceInUSD(
          cellarConfig.baseAsset.address
        )

        if (!basePrice) {
          throw new Error(
            "Price router could not price: " + cellarConfig.baseAsset
          )
        }
        const formattedBaseAssetPrice = basePrice / 10 ** 8

        // Get alternative asset price in usd from priceRouter
        const altAssetPrice = await priceRouterContract.getPriceInUSD(
          cellarConfig.baseAsset.address
        )

        if (!altAssetPrice) {
          throw new Error(
            "Price router could not price: " + cellarConfig.baseAsset
          )
        }
        const formattedAltAssetPrice = altAssetPrice / 10 ** 8

        assetRatio = formattedBaseAssetPrice / formattedAltAssetPrice
      }

      const sharePriceWithDiscountInSelectedBaseDenom = Math.floor(
        sharePriceWithDiscount *
          assetRatio *
          10 ** selectedToken!.decimals
      )

      // Finalize Input Touple
      const withdrawTouple = [
        BigInt(deadlineSeconds),
        BigInt(sharePriceWithDiscountInSelectedBaseDenom),
        withdrawAmtInBaseDenom,
        false,
      ]

      //!
      console.log("activeWithdrawRequestDenom", activeWithdrawRequestDenom)
      console.log("Selected Token", selectedToken)
      // If user has different asset atomic request open cancel it first!!!! -----
      if (activeWithdrawRequestDenom && activeWithdrawRequestDenom.address !== selectedToken!.address) {
        // Cancel this request first 
        const previousTouple = [
          BigInt(0),
          BigInt(0),
          0,
          false,
        ]

        const gasLimitEstimated = await estimateGasLimitWithRetry(
          withdrawQueueContract?.estimateGas.updateAtomicRequest,
          withdrawQueueContract?.callStatic.updateAtomicRequest,
          [
            cellarConfig.cellar.address,
            activeWithdrawRequestDenom.address,
            previousTouple,
          ],
          330000,
          660000
        )

        const tx = await withdrawQueueContract?.updateAtomicRequest(
          cellarConfig.cellar.address, // Offer/cellar address
          activeWithdrawRequestDenom.address, // want/token out desired
          previousTouple,
          {
            gasLimit: gasLimitEstimated,
          }
        )

        if (tx) {
          const onSuccess = () => {
            if (onSuccessfulWithdraw) {
              onSuccessfulWithdraw()
            }
            onClose() // Close modal after successful withdraw.
          }

          const onError = (error: Error) => {
            // Can track here if we want
            throw new Error("Failed to cancel existing withdraw request before submitting new withdraw request")
          }

          await doHandleTransaction({
            cellarConfig,
            ...tx,
            onSuccess,
            onError,
          })
        } else {
          throw new Error("Tx not returned to cancel existing withdraw request before submitting new withdraw request")
        }

      }

      const gasLimitEstimated = await estimateGasLimitWithRetry(
        withdrawQueueContract?.estimateGas.updateAtomicRequest,
        withdrawQueueContract?.callStatic.updateAtomicRequest,
        [
          cellarConfig.cellar.address,
          selectedToken!.address,
          withdrawTouple,
        ],
        330000,
        660000
      )

      const tx = await withdrawQueueContract?.updateAtomicRequest(
        cellarConfig.cellar.address, // Offer/cellar address
        selectedToken!.address, // want/token out desired
        withdrawTouple,
        {
          gasLimit: gasLimitEstimated,
        }
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
        ...tx,
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

  const [isActiveWithdrawRequest, setIsActiveWithdrawRequest] =
    useState(false)
  const [activeWithdrawRequestDenom, setActiveWithdrawRequestDenom] =
    useState<Token | null>(null)

  // Check if a user has an active withdraw request
  const checkWithdrawRequest = async () => {
    try {
      if (withdrawQueueContract && address && cellarConfig) {
        // Loop through all vault deposit assets and check if the user has an active withdraw request for any of them
        for (const token of cellarDataMap[id].depositTokens.list) {
          const potentialToken = tokenConfig.find(
            (t) =>
              t.symbol === token && t.chain === cellarConfig.chain.id
          )!

          const withdrawRequest =
            await withdrawQueueContract?.getUserAtomicRequest(
              address, // User
              cellarConfig.cellar.address, // Offer token
              potentialToken.address // Want token
            )

          // Check if it's valid
          const isWithdrawRequestValid =
            await withdrawQueueContract?.isAtomicRequestValid(
              cellarConfig.cellar.address, // Vault
              address, // User
              withdrawRequest // Request
            )

          if (isWithdrawRequestValid) {
            setIsActiveWithdrawRequest(true)
            setActiveWithdrawRequestDenom(potentialToken)
            return
          }
        }
      } else {
        setIsActiveWithdrawRequest(false)
      }
    } catch (error) {
      console.log(error)
      setIsActiveWithdrawRequest(false)
    }
  }
  checkWithdrawRequest()

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
                  depositTokens={cellarDataMap[id].depositTokens.list}
                  activeAsset={strategyBaseAsset.address}
                  setSelectedToken={trackedSetSelectedToken}
                  isDisabled={isSubmitting}
                />
              }
            </HStack>
            <HStack justify="space-between" alignItems="start">
              <Tooltip
                hasArrow
                placement="top-start"
                label={
                  "Preconfigured options that allow you to specify how aggressive you would like your withdraw request to be."
                }
                bg="surface.bg"
                color="neutral.300"
              >
                <HStack spacing={1} align="center">
                  <Text as="span">Priority</Text>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Tooltip>
              <VStack align="end">
                <ButtonGroup
                  isAttached
                  variant="solid"
                  backgroundColor="surface.tertiary"
                  borderRadius={16}
                >
                  {(["Low", "Mid", "High"] as PresetValueKey[]).map(
                    (level, index, array) => (
                      <Button
                        key={level}
                        colorScheme={
                          selectedPriority === level
                            ? "purple"
                            : "none"
                        }
                        onClick={() => handleSelect(level)}
                        borderRadius={16}
                        size="sm"
                        textColor={
                          selectedPriority === level
                            ? "neutral.600"
                            : "white"
                        }
                      >
                        {level}
                      </Button>
                    )
                  )}
                </ButtonGroup>
                {/*
                <Text
                  fontSize="sm"
                  cursor="pointer"
                  color={
                    selectedPriority === "Custom"
                      ? "purple.light"
                      : "gray.500"
                  }
                  fontWeight={
                    selectedPriority === "Custom" ? "bold" : "none"
                  }
                  onClick={() => handleSelect("Custom")}
                  mt={2}
                >
                  Custom
                </Text>
                */}
              </VStack>
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
                    defaultValue="0.00"
                    placeholder="0.00"
                    fontSize="lg"
                    fontWeight={700}
                    textAlign="right"
                    backgroundColor={
                      selectedPriority === "Custom"
                        ? "surface.tertiary"
                        : "none" //"neutral.500"
                    }
                    padding={2}
                    borderRadius={16}
                    pr={8}
                    height="2.2em"
                    disabled={selectedPriority !== "Custom"}
                    {...register("sharePriceDiscountPercent", {
                      onChange: (event) => {
                        let val = event.target.value

                        const decimalPos = val.indexOf(".")

                        if (
                          decimalPos !== -1 &&
                          val.length - decimalPos - 1 > 2
                        ) {
                          val = val.substring(0, decimalPos + 3)
                          event.target.value = val
                        }
                      },
                      required: "Enter amount",
                      valueAsNumber: true,
                      validate: {
                        positive: (v) =>
                          v >= 0 ||
                          "You must submit a positive amount.",
                      },
                    })}
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
                  defaultValue="0.00"
                  placeholder="0.00"
                  fontSize="lg"
                  fontWeight={700}
                  textAlign="right"
                  backgroundColor={
                    selectedPriority === "Custom"
                      ? "surface.tertiary"
                      : "none" //"neutral.500"
                  }
                  width="25%"
                  padding={2}
                  borderRadius={16}
                  height="2.2em"
                  disabled={selectedPriority !== "Custom"}
                  {...register("deadlineHours", {
                    onChange: (event) => {
                      let val = event.target.value

                      const decimalPos = val.indexOf(".")

                      if (
                        decimalPos !== -1 &&
                        val.length - decimalPos - 1 > 2
                      ) {
                        val = val.substring(0, decimalPos + 3)
                        event.target.value = val
                      }
                    },
                    required: "Enter amount",
                    valueAsNumber: true,
                    validate: {
                      positive: (v) =>
                        v > 0 || "You must submit a positive amount.",
                    },
                  })}
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
      <FAQAccordion
        data={[
          {
            question: "What is the Withdraw Queue?",
            answer: `The Withdraw Queue is a way for users to submit a withdraw request if they are trying to withdraw more than the liquid reserve from a strategy, or if they want to recieve a specific asset out. Once the request is submitted, it will be eventually fulfilled on behalf of the user and the withdrawn funds will appear automatically in the user's wallet (assuming the requests is fulfilled within the time constraint specified by the user). A withdraw request through the queue also has a much lower gas cost for users compared to instant withdrawals.`,
          },
        ]}
      />
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

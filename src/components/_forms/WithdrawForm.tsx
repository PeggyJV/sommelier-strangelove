import React, { useEffect, useMemo, VFC } from "react"
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
  Avatar,
  Text,
  Link
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { useBrandedToast } from "hooks/chakra"
import { useAccount } from "wagmi"
import { toEther } from "utils/formatCurrency"
import { ethers } from "ethers"
import { useHandleTransaction } from "hooks/web3"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalances } from "data/hooks/useUserBalances"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { WarningIcon } from "components/_icons"
import { useCurrentPosition } from "data/hooks/useCurrentPosition"
import { tokenConfig } from "data/tokenConfig"
import BigNumber from "bignumber.js"
import {
  isAssetDistributionEnabled,
  isWithdrawTokenPriceEnabled,
  waitTime,
} from "data/uiConfig"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { fetchCellarRedeemableReserves } from "queries/get-cellar-redeemable-asssets"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"

interface FormValues {
  withdrawAmount: number
}

interface WithdrawFormProps {
  onClose: () => void
}

export const WithdrawForm: VFC<WithdrawFormProps> = ({ onClose }) => {
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

  const id = (useRouter().query.id as string) || _id
  const cellarConfig = cellarDataMap[id].config

  const { refetch } = useUserStrategyData(cellarConfig.cellar.address)
  const { data: strategyData } = useStrategyData(
    cellarConfig.cellar.address
  )
  const tokenPrice = strategyData?.tokenPrice

  const { cellarSigner } = useCreateContracts(cellarConfig)

  const { lpToken } = useUserBalances(cellarConfig)
  const { data: lpTokenData, isLoading: isBalanceLoading } = lpToken

  const { doHandleTransaction } = useHandleTransaction()

  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount

  const currentPosition = useCurrentPosition(cellarConfig)

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, lpTokenData?.decimals, false, 6)
    )
    setValue("withdrawAmount", amount)

    analytics.track("withdraw.max-selected", {
      account: address,
      amount,
    })
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

    analytics.track("withdraw.started", analyticsData)

    const amtInWei = ethers.utils.parseUnits(`${withdrawAmount}`, 18)

    try {
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        cellarSigner?.estimateGas.redeem,
        cellarSigner?.callStatic.redeem,
        [amtInWei, address, address],
        330000,
        660000
      )

      const tx = await cellarSigner?.redeem(
        amtInWei,
        address,
        address,
        {
          gasLimit: gasLimitEstimated,
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
        ...tx,
        onSuccess,
        onError,
      })
    } catch (e) {
      const error = e as Error

      // Get Redeemable Assets
      const redeemableAssets: number = parseInt(await fetchCellarRedeemableReserves(id))

      // previewRedeem on the shares the user is attempting to withdraw
      // Only get previewRedeem on 1 share to optimize caching and do relevant math below
      const previewRedeem: number = parseInt(await fetchCellarPreviewRedeem(id, BigInt(1e18)))
      const redeemAmt: number = Math.floor(previewRedeem * watchWithdrawAmount)
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
        addToast({
          heading: "Transaction not submitted.",
          body: (
            <Text>
              You are attempting to withdraw beyond the the liquid
              reserve. The strategist will need to initiate a
              rebalance to service your full withdrawal. Please send a
              message in our{" "}
              {
                <Link
                  href="https://discord.com/channels/814266181267619840/814279703622844426"
                  isExternal
                  textDecoration="underline"
                >
                  Discord Support channel
                </Link>
              }{" "}
              tagging @StrategistSupport
            </Text>
          ),
          status: "info",
          closeHandler: closeAll,
          duration: null, // Persist this toast until user closes it.
        })
      } else {
        if (error.message === "GAS_LIMIT_ERROR") {
          addToast({
            heading: "Transaction not submitted",
            body: (
              <Text>
                The gas fees are particularly high right now. To avoid
                a failed transaction leading to wasted gas, please try
                again later.
              </Text>
            ),
            status: "info",
            closeHandler: closeAll,
          })
        } else {
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

  useEffect(() => {
    currentPosition.refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const estimatedUSD = useMemo(() => {
    let total = 0
    currentPosition.data?.positions
      ?.filter((item) => Number(item.withdrawable) > 0)
      .forEach((item) => {
        const withdrawable =
          Number(item.withdrawable) / Math.pow(10, item.decimals)

        const resultWithdraw = new BigNumber(watchWithdrawAmount || 0)
          .div(
            new BigNumber(
              toEther(
                lpTokenData?.formatted,
                lpTokenData?.decimals,
                false,
                6
              )
            )
          )
          .times(withdrawable)

        const resultWithdrawUSD = resultWithdraw
          .times(item.usdPrice)
          .toNumber()
        total += resultWithdrawUSD
      })
    return total
  }, [
    currentPosition.data?.positions,
    lpTokenData?.decimals,
    lpTokenData?.formatted,
    watchWithdrawAmount,
  ])

  const currentPositionLoading =
    currentPosition.isLoading ||
    currentPosition.isRefetching ||
    currentPosition.isFetching

  return (
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
              <Text fontWeight="semibold">{lpTokenData?.symbol}</Text>
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
          {isAssetDistributionEnabled(cellarConfig) && (
            <HStack pt={2}>
              <WarningIcon color="orange.base" boxSize="12px" />
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="orange.light"
              >
                Tokens are swapped to the actively traded vault assets
                which may include multiple assets in varying
                distribution
              </Text>
            </HStack>
          )}
        </Stack>
      </FormControl>
      <Stack>
        <Text fontSize="sm" fontWeight="semibold" color="neutral.400">
          Transaction Details
        </Text>
        <Stack>
          <TransactionDetailItem
            title="Vault"
            value={<Text>{cellarDataMap[id].name}</Text>}
          />
          {isWithdrawTokenPriceEnabled(cellarConfig) && (
            <TransactionDetailItem
              title="Token price"
              value={<Text>{tokenPrice}</Text>}
            />
          )}
          {isAssetDistributionEnabled(cellarConfig) && (
            <>
              <TransactionDetailItem
                title="Assets"
                value={
                  currentPositionLoading ? (
                    <Spinner />
                  ) : currentPosition.isError ? (
                    <Text>(Can't load)</Text>
                  ) : (
                    currentPosition.data?.positions.map((item) => {
                      if (!item) return <Text>--</Text>
                      const token = tokenConfig.find(
                        (token) =>
                          token.address === item.address.toLowerCase()
                      )
                      const withdrawable =
                        Number(item.withdrawable) /
                        Math.pow(10, item.decimals)

                      const percentage = item.ratio
                        .times(100)
                        .toNumber()

                      const resultWithdraw = new BigNumber(
                        watchWithdrawAmount || 0
                      )
                        .div(
                          new BigNumber(
                            toEther(
                              lpTokenData?.formatted,
                              lpTokenData?.decimals,
                              false,
                              6
                            )
                          )
                        )
                        .times(withdrawable)
                        .toNumber()

                      return (
                        <HStack
                          key={item.address}
                          justifyContent="space-between"
                        >
                          <Avatar
                            boxSize={6}
                            src={token?.src}
                            name={token?.alt}
                            borderWidth={2}
                            borderColor="surface.bg"
                            bg="surface.bg"
                          />
                          <Text>
                            {fixed(resultWithdraw, 8)} {token?.symbol}{" "}
                            ({fixed(percentage, 2)}
                            %)
                          </Text>
                        </HStack>
                      )
                    })
                  )
                }
              />
              <TransactionDetailItem
                title="Estimated USD"
                value={
                  currentPositionLoading ? (
                    <Spinner />
                  ) : currentPosition.isError ? (
                    <Text>(Can't load)</Text>
                  ) : (
                    <Text>≈ ${fixed(estimatedUSD || 0, 6)}</Text>
                  )
                }
              />
            </>
          )}
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
      <Text textAlign="center">
        Please wait {waitTime(cellarConfig)} after the deposit to
        Withdraw
      </Text>
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

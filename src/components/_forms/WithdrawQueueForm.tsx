import React, { useEffect, VFC } from "react"
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
import { waitTime } from "data/uiConfig"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { useStrategyData } from "data/hooks/useStrategyData"
import { useDepositModalStore } from "data/hooks/useDepositModalStore"
import { fetchCellarRedeemableReserves } from "queries/get-cellar-redeemable-asssets"
import { fetchCellarPreviewRedeem } from "queries/get-cellar-preview-redeem"
import { getTokenConfig, Token } from "data/tokenConfig"

interface FormValues {
  withdrawAmount: number
}

interface WithdrawQueueFormProps {
  onClose: () => void
}

function scientificToDecimalString(num: number) {
    // If the number is in scientific notation, split it into base and exponent
    const sign = Math.sign(num);
    let [base, exponent] = num.toString().split('e').map(item => parseInt(item, 10));

    // Adjust for negative exponent
    if (exponent < 0) {
        let decimalString = Math.abs(base).toString();
        let padding = Math.abs(exponent) - 1;
        return (sign < 0 ? "-" : "") + "0." + "0".repeat(padding) + decimalString;
    }

    // Handle positive exponent or non-scientific numbers (which won't be split)
    return num.toString();
}

export const WithdrawQueueForm: VFC<WithdrawQueueFormProps> = ({
  onClose,
}) => {
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

  const { lpToken } = useUserBalances(cellarConfig)
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
  }

  const geo = useGeo()
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

    const amtInBaseDenom = ethers.utils.parseUnits(
      `${withdrawAmount}`,
      cellarConfig.cellar.decimals
    )

    try {
      // TODO: Send tx
      /*
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        cellarSigner?.estimateGas.redeem,
        cellarSigner?.callStatic.redeem,
        [amtInBaseDenom, address, address],
        330000,
        660000
      )

      const tx = await cellarSigner?.redeem(
        amtInBaseDenom,
        address,
        address,
        {
          gasLimit: gasLimitEstimated,
        }
      )
      */

      const onSuccess = () => {
        onClose() // Close modal after successful withdraw.
      }

      const onError = (error: Error) => {
        // TODO
      }

      // TODO: Broadcast tx
      /*
      await doHandleTransaction({
        cellarConfig,
        ...tx,
        onSuccess,
        onError,
      })
      */
    } catch (e) {
      const error = e as Error

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
      setValue("withdrawAmount", 0)
    }
  }

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
                  onChange: (event) => {
                    let val = event.target.value

                    const decimalPos = val.indexOf(".")

                    if (
                      decimalPos !== -1 &&
                      val.length - decimalPos - 1 > cellarConfig.cellar.decimals
                    ) {
                      val = val.substring(
                        0,
                        decimalPos + cellarConfig.cellar.decimals + 1
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
        <Text fontSize="sm" fontWeight="semibold" color="neutral.400">
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
          enter the Withdraw Queue.
        </Text>
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

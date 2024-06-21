import {
  Button,
  FormControl,
  FormErrorMessage,
  Heading,
  HStack,
  Icon,
  Image,
  Input,
  ModalProps,
  Text,
  VStack,
  Tooltip,
  Th,
  Link,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { CardHeading } from "components/_typography/CardHeading"
import { BondingPeriodOptions } from "./BondingPeriodOptions"
import { toEther } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import { useApproveERC20, useHandleTransaction } from "hooks/web3"
import { analytics } from "utils/analytics"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalance } from "data/hooks/useUserBalance"
import { bondingPeriodOptions } from "data/uiConfig"
import { estimateGasLimitWithRetry } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
import { InformationIcon } from "components/_icons"
import { waitTime } from "data/uiConfig"
import { useAccount } from "wagmi"
import { parseUnits } from "viem"

interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

type BondFormProps = Pick<ModalProps, "onClose">

export const BondForm = ({ onClose }: BondFormProps) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { refetch } = useUserStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )
  const { stakerSigner } = useCreateContracts(cellarConfig)

  const { address } = useAccount()

  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData } = lpToken

  const methods = useForm<FormValues>({
    defaultValues: { bondingPeriod: 0 },
  })
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = methods
  const { addToast, closeAll } = useBrandedToast()

  const { doApprove } = useApproveERC20({
    tokenAddress: cellarConfig.cellar.address,
    spender: cellarConfig.staker?.address!,
  })

  const { doHandleTransaction } = useHandleTransaction()

  const watchDepositAmount = watch("depositAmount")
  const bondPeriod = watch("bondingPeriod")

  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount

  const setMax = () =>
    setValue(
      "depositAmount",
      parseFloat(
        toEther(
          lpTokenData?.formatted,
          lpTokenData?.decimals,
          false,
          6
        )
      )
    )

  const geo = useGeo()

  const onSubmit = async (data: FormValues) => {
    if (geo?.isRestrictedAndOpenModal()) {
      return
    }
    if (!stakerSigner) {
      return addToast({
        heading: "No wallet connected",
        body: <Text>Please connect your wallet</Text>,
        status: "error",
        closeHandler: closeAll,
      })
    }
    const analyticsData = {
      duration: bondingPeriodOptions(cellarConfig)[bondPeriod],
    }
    // analytics.track("bond.started", analyticsData)

    try {
      await doApprove(data.depositAmount, {
        onSuccess: () => analytics.track("bond.approval-succeeded"),
        onError: (error) => {
          analytics.track("bond.approval-failed")
          throw error
        },
      })

      const depositAmtInWei = parseUnits(
        data.depositAmount.toString(),
        cellarConfig.cellar.decimals
      )
      const gasLimitEstimated = await estimateGasLimitWithRetry(
        stakerSigner.estimateGas.stake,
        stakerSigner.simulate.stake,
        [depositAmtInWei, bondPeriod],
        250000,
        address
      )
      // @ts-ignore
      const hash = await stakerSigner.write.stake([
        depositAmtInWei,
        bondPeriod
        ],
        { gas: gasLimitEstimated, account: address }
      )

      await doHandleTransaction({
        cellarConfig,
        hash,
        onSuccess: () => {
          analytics.track("bond.succeeded", analyticsData)
          refetch()
          onClose()
        },
        onError: () => analytics.track("bond.failed", analyticsData),
      })
      refetch()
    } catch (e) {
      const error = e as Error
      console.error(error.message)
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
        addToast({
          heading: "Staking LP Tokens",
          body: <Text>Tx Cancelled</Text>,
          status: "info",
          closeHandler: closeAll,
        })
      }
    }
  }

  const onError = (errors: any, e: any) => {
    addToast({
      heading: "Bonding LP Token",
      body: <Text>Bonding Failed</Text>,
      status: "error",
      closeHandler: closeAll,
    })
  }

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        spacing={8}
        align="stretch"
        onSubmit={handleSubmit(onSubmit, onError)}
      >
        <FormControl isInvalid={isError as boolean | undefined}>
          <HStack
            p={4}
            justifyContent="space-between"
            w="100%"
            bg="surface.secondary"
            border="none"
            borderRadius={16}
            appearance="none"
            textAlign="start"
            _first={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <HStack>
              {cellarConfig.lpToken.imagePath && (
                <Image
                  src={cellarConfig.lpToken.imagePath}
                  alt="lp token image"
                  height="22px"
                />
              )}

              <Heading size="sm">{cellarConfig.lpToken.imagePath}</Heading>
            </HStack>
            <VStack spacing={0} align="flex-end">
              <FormControl isInvalid={isError as boolean | undefined}>
                <Input
                  variant="unstyled"
                  pr="2"
                  type="number"
                  step="any"
                  defaultValue="0.00"
                  placeholder="0.00"
                  fontSize="lg"
                  fontWeight={700}
                  textAlign="right"
                  {...register("depositAmount", {
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
              </FormControl>
              <HStack spacing={0} fontSize="10px">
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
                  onClick={setMax}
                  fontSize="inherit"
                  fontWeight={600}
                >
                  max
                </Button>
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
            />{" "}
            {errors.depositAmount?.message}
          </FormErrorMessage>
        </FormControl>
        <VStack align="stretch">
          <CardHeading>
            <Tooltip
              hasArrow
              arrowShadowColor="purple.base"
              label="This is the period you must wait before your tokens are transferable/withdrawable"
              placement="top"
              bg="surface.bg"
              color="neutral.300"
            >
              <Th
                fontSize={10}
                fontWeight="normal"
                textTransform="capitalize"
              >
                <HStack spacing={1} align="center">
                  <Text>Unbonding period</Text>
                  <InformationIcon color="neutral.300" boxSize={3} />
                </HStack>
              </Th>
            </Tooltip>
          </CardHeading>

          <BondingPeriodOptions cellarConfig={cellarConfig} />
        </VStack>
        {/* <Text fontSize="xs">
          After triggering 'Unbond,' you will need to wait through the
          unbonding period you selected, after which your LP tokens
          can be unstaked and withdrawn.
        </Text> */}
        <BaseButton
          type="submit"
          isDisabled={isDisabled}
          isLoading={isSubmitting}
          fontSize={21}
          py={6}
          px={12}
        >
          Bond
        </BaseButton>
        {waitTime(cellarConfig) !== null && (
          <Text textAlign="center">
            Please wait {waitTime(cellarConfig)} after the deposit to
            Bond
          </Text>
        )}
      </VStack>
    </FormProvider>
  )
}

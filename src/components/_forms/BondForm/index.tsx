import { VFC } from "react"
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
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { CardHeading } from "components/_typography/CardHeading"
import { BondingPeriodOptions } from "./BondingPeriodOptions"
import { toEther } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import { BigNumber } from "bignumber.js"
import { useApproveERC20, useHandleTransaction } from "hooks/web3"
import { ethers } from "ethers"
import { analytics } from "utils/analytics"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalances } from "data/hooks/useUserBalances"
import { useUserStakes } from "data/hooks/useUserStakes"
import { bondingPeriodOptions } from "data/uiConfig"
import { estimateGasLimit } from "utils/estimateGasLimit"
import { useGeo } from "context/geoContext"

interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

type BondFormProps = Pick<ModalProps, "onClose">

export const BondForm: VFC<BondFormProps> = ({ onClose }) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { refetch: userStakesRefetch } = useUserStakes(cellarConfig)
  const { stakerSigner } = useCreateContracts(cellarConfig)

  const { lpToken, lpTokenInfo } = useUserBalances(cellarConfig)
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
      parseFloat(toEther(lpTokenData?.formatted, 18, false) || "")
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
    analytics.track("bond.started", analyticsData)
    await doApprove(data.depositAmount, {
      onSuccess: () => analytics.track("bond.approval-succeeded"),
      onError: () => analytics.track("bond.approval-failed"),
    })

    const amtInBigNumber = new BigNumber(data.depositAmount)
    const depositAmtInWei = ethers.utils.parseUnits(
      amtInBigNumber.toFixed(),
      18
    )

    try {
      const gasLimit = await estimateGasLimit(
        stakerSigner.estimateGas.stake(depositAmtInWei, bondPeriod),
        250000 // known gasLimit
      )

      const { hash: bondConf } = await stakerSigner.stake(
        depositAmtInWei,
        bondPeriod,
        { gasLimit }
      )

      await doHandleTransaction({
        hash: bondConf,
        onSuccess: () => {
          analytics.track("bond.succeeded", analyticsData)
          userStakesRefetch()
          onClose()
        },
        onError: () => analytics.track("bond.failed", analyticsData),
      })
      userStakesRefetch()
    } catch (e) {
      addToast({
        heading: "Staking LP Tokens",
        body: <Text>Tx Cancelled</Text>,
        status: "info",
        closeHandler: closeAll,
      })
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

              <Heading size="sm">{lpTokenInfo.data?.symbol}</Heading>
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
                            toEther(lpTokenData?.formatted, 18, false)
                          ) || "Insufficient balance",
                    },
                  })}
                />
              </FormControl>
              <HStack spacing={0} fontSize="10px">
                <Text as="span">
                  Available:{" "}
                  {toEther(lpTokenData?.formatted, 18, false)}
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
          <CardHeading>Bonding Period</CardHeading>
          <BondingPeriodOptions cellarConfig={cellarConfig} />
        </VStack>
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
        <Text textAlign="center">
          Please wait 15 min after the deposit to Bond
        </Text>
      </VStack>
    </FormProvider>
  )
}

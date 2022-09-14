import { VFC } from "react"
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  ModalProps,
  Text,
  VStack,
} from "@chakra-ui/react"
import { FormProvider, useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { ModalInput } from "components/_inputs/ModalInput"
import { CardHeading } from "components/_typography/CardHeading"
import { BondingPeriodOptions } from "./BondingPeriodOptions"
import { toEther } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import { BigNumber } from "bignumber.js"
import { useApproveERC20, useHandleTransaction } from "hooks/web3"
import { ethers } from "ethers"
import { analytics } from "utils/analytics"
import { bondingPeriodOptions } from "./BondingPeriodOptions"
import { useUserBalances } from "src/composite-data/hooks/output/useUserBalances"
import { cellarDataMap } from "data/cellarDataMap"
import { useRouter } from "next/router"
import { useCreateContracts } from "src/composite-data/hooks/output/useCreateContracts"
import { useOutputUserData } from "src/composite-data/hooks/output/useOutputUserData"

interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

type BondFormProps = Pick<ModalProps, "onClose">

export const BondForm: VFC<BondFormProps> = ({ onClose }) => {
  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { refetch: refetchOutputUserData } =
    useOutputUserData(cellarConfig)
  const { stakerSigner } = useCreateContracts(cellarConfig)

  const { lpToken } = useUserBalances(cellarConfig)
  const [{ data: lpTokenData }] = lpToken

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
    spender: cellarConfig.staker.address,
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

  const onSubmit = async (data: FormValues) => {
    const analyticsData = {
      duration: bondingPeriodOptions[bondPeriod],
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
      const { hash: bondConf } = await stakerSigner.stake(
        depositAmtInWei,
        bondPeriod,
        // gas used around 125000-130000
        { gasLimit: 200000 }
      )

      await doHandleTransaction({
        hash: bondConf,
        onSuccess: () => {
          analytics.track("bond.succeeded", analyticsData)
          refetchOutputUserData()
          onClose()
        },
        onError: () => analytics.track("bond.failed", analyticsData),
      })
      refetchOutputUserData()
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
        <VStack align="stretch">
          <CardHeading>Bonding Period</CardHeading>
          <BondingPeriodOptions />
        </VStack>
        <FormControl isInvalid={isError as boolean | undefined}>
          <InputGroup display="flex" alignItems="center">
            <ModalInput
              type="number"
              step="any"
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
            <InputRightElement h="100%" mr={3}>
              <SecondaryButton
                size="sm"
                borderRadius={8}
                onClick={setMax}
              >
                Max
              </SecondaryButton>
            </InputRightElement>
          </InputGroup>
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
        <BaseButton
          type="submit"
          isDisabled={isDisabled}
          isLoading={isSubmitting}
          fontSize={21}
          py={6}
          px={12}
        >
          Bond LP Tokens
        </BaseButton>
      </VStack>
    </FormProvider>
  )
}

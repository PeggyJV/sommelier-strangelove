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
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { useAaveStaker } from "context/aaveStakerContext"
import { toEther } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import { BigNumber } from "bignumber.js"
import { useApproveERC20, useHandleTransaction } from "hooks/web3"
import { config } from "utils/config"
import { useContract, useSigner } from "wagmi"
import { ethers } from "ethers"
import { analytics } from "utils/analytics"
import { bondingPeriodOptions } from "./BondingPeriodOptions"

interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

type BondFormProps = Pick<ModalProps, "onClose">

export const BondForm: VFC<BondFormProps> = ({ onClose }) => {
  const { userData, fetchUserData } = useAaveV2Cellar()
  const { fetchUserStakes } = useAaveStaker()
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
  const { addToast, update, close, closeAll } = useBrandedToast()
  const { AAVE_V2_STABLE_CELLAR, AAVE_STAKER } = config.CONTRACT
  const [{ data: signer }] = useSigner()
  const { doApprove } = useApproveERC20({
    tokenAddress: AAVE_V2_STABLE_CELLAR?.ADDRESS,
    spender: AAVE_STAKER?.ADDRESS,
  })
  const { doHandleTransaction } = useHandleTransaction()
  const sommStakingContract = useContract({
    addressOrName: config.CONTRACT.AAVE_STAKER.ADDRESS,
    contractInterface: config.CONTRACT.AAVE_STAKER.ABI,
    signerOrProvider: signer,
  })
  const watchDepositAmount = watch("depositAmount")
  const bondPeriod = watch("bondingPeriod")

  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount
  const setMax = () =>
    setValue(
      "depositAmount",
      parseFloat(
        toEther(userData?.balances?.aaveClr, 18, false) || ""
      )
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
      const { hash: bondConf } = await sommStakingContract.stake(
        depositAmtInWei,
        bondPeriod,
        // gas used around 125000-130000
        { gasLimit: 200000 }
      )

      await doHandleTransaction({
        hash: bondConf,
        onSuccess: () => {
          analytics.track("bond.succeeded", analyticsData)
          fetchUserData()
          onClose()
        },
        onError: () => analytics.track("bond.failed", analyticsData),
      })
      fetchUserStakes()
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

import { VFC } from "react"
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
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
import { toEther } from "utils/formatCurrency"
import { useBrandedToast } from "hooks/chakra"
import { BigNumber } from "bignumber.js"
import { useApproveERC20, useHandleTransaction } from "hooks/web3"
import { config } from "utils/config"
import { useContract, useSigner } from "wagmi"
import { ethers } from "ethers"
interface FormValues {
  depositAmount: number
  bondingPeriod: number
}

export const BondForm: VFC = () => {
  const { userData } = useAaveV2Cellar()
  const methods = useForm<FormValues>({
    defaultValues: { bondingPeriod: 1.1 },
  })
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = methods
  const { addToast, update, close, closeAll } = useBrandedToast()
  const { AAVE_V2_STABLE_CELLAR, SOMM_STAKING } = config.CONTRACT
  const [{ data: signer }] = useSigner()
  const { doApprove } = useApproveERC20({
    tokenAddress: AAVE_V2_STABLE_CELLAR?.ADDRESS,
    spender: SOMM_STAKING?.ADDRESS,
  })
  const { doHandleTransaction } = useHandleTransaction()
  const sommStakingContract = useContract({
    addressOrName: config.CONTRACT.SOMM_STAKING.ADDRESS,
    contractInterface: config.CONTRACT.SOMM_STAKING.ABI,
    signerOrProvider: signer,
  })
  const watchDepositAmount = watch("depositAmount")
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount
  const setMax = () =>
    setValue(
      "depositAmount",
      parseFloat(toEther(userData?.balances?.aaveClr) || "")
    )

  const onSubmit = async (data: any, e: any) => {
    doApprove(data?.depositAmount)
    const amtInBigNumber = new BigNumber(data?.depositAmount)
    const depositAmtInWei = ethers.utils.parseUnits(
      amtInBigNumber.toFixed(),
      18
    )
    try {
      console.log(`stake :: `, depositAmtInWei)
      const { hash: bondConf } = await sommStakingContract.stake(
        depositAmtInWei,
        0
      )
      doHandleTransaction({ hash: bondConf })
    } catch (e) {
      addToast({
        heading: "Staking LP Tokens",
        body: <Text>Tx Cancelled</Text>,
        status: "warning",
        closeHandler: closeAll,
      })
    }
  }

  const onError = (errors: any, e: any) => {
    console.log(errors, e)
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
                  lessThanBalance: (v) =>
                    v <=
                      parseFloat(
                        toEther(userData?.balances?.aaveClr)
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

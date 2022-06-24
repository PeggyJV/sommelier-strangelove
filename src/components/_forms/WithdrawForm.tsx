import { useEffect, VFC } from "react"
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  Text,
  InputRightElement,
  VStack,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { ModalInput } from "components/_inputs/ModalInput"
import { useBrandedToast } from "hooks/chakra"
import { useAccount } from "wagmi"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { toEther } from "utils/formatCurrency"
import { ethers } from "ethers"
import { useHandleTransaction } from "hooks/web3"
import { analytics } from "utils/analytics"
interface FormValues {
  withdrawAmount: number
}

export const WithdrawForm: VFC = () => {
  const {
    register,
    watch,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()
  const { aaveCellarSigner, userData, fetchUserData } =
    useAaveV2Cellar()
  const { addToast, update, close, closeAll } = useBrandedToast()
  const [{ data: account }] = useAccount()
  const { doHandleTransaction } = useHandleTransaction()
  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount
  const setMax = () => {
    const amount = parseFloat(
      toEther(userData?.balances?.aaveClr, 18, false)
    )
    setValue("withdrawAmount", amount)

    analytics.track("withdraw.max-selected", {
      account: account?.address,
      amount,
    })
  }

  useEffect(() => {
    if (watchWithdrawAmount != null) {
      analytics.track("withdraw.amount-selected", {
        account: account?.address,
        amount: watchWithdrawAmount,
      })
    }
  }, [watchWithdrawAmount, account])

  const onSubmit = async ({ withdrawAmount }: FormValues) => {
    if (withdrawAmount <= 0) return

    if (!account?.address) {
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
      account: account.address,
      amount: withdrawAmount,
    }

    analytics.track("withdraw.started", analyticsData)

    const amtInWei = ethers.utils.parseUnits(`${withdrawAmount}`, 18)
    const tx = await aaveCellarSigner.withdraw(
      amtInWei,
      account.address,
      account.address
    )

    function onSuccess() {
      analytics.track("withdraw.succeeded", analyticsData)
    }

    function onError(error: Error) {
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

    await fetchUserData()

    setValue("withdrawAmount", 0)
  }

  return (
    <VStack
      as="form"
      spacing={8}
      align="stretch"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl isInvalid={isError as boolean | undefined}>
        <InputGroup display="flex" alignItems="center">
          <ModalInput
            type="number"
            step="any"
            {...register("withdrawAmount", {
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
          {errors.withdrawAmount?.message}
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
        Withdraw Liquidity
      </BaseButton>
    </VStack>
  )
}

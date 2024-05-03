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
import { toEther } from "utils/formatCurrency"
import { ethers } from "ethers"
import { useHandleTransaction } from "hooks/web3"
import { analytics } from "utils/analytics"
import { useRouter } from "next/router"
import { cellarDataMap } from "data/cellarDataMap"
import { useCreateContracts } from "data/hooks/useCreateContracts"
import { useUserBalance } from "data/hooks/useUserBalance"
import { useGeo } from "context/geoContext"
import { useUserStrategyData } from "data/hooks/useUserStrategyData"
interface FormValues {
  withdrawAmount: number
}

interface UnstakeFormProps {
  onClose: () => void
}

export const UnstakeForm: VFC<UnstakeFormProps> = ({ onClose }) => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()

  const { addToast } = useBrandedToast()
  const { address } = useAccount()

  const id = useRouter().query.id as string
  const cellarConfig = cellarDataMap[id].config

  const { cellarSigner } = useCreateContracts(cellarConfig)

  const { refetch } = useUserStrategyData(cellarConfig.cellar.address, cellarConfig.chain.id)
  const { lpToken } = useUserBalance(cellarConfig)
  const { data: lpTokenData } = lpToken

  const { doHandleTransaction } = useHandleTransaction()

  const watchWithdrawAmount = watch("withdrawAmount")
  const isDisabled =
    isNaN(watchWithdrawAmount) || watchWithdrawAmount <= 0
  const isError = errors.withdrawAmount

  const setMax = () => {
    const amount = parseFloat(
      toEther(lpTokenData?.formatted, 18, false)
    )
    setValue("withdrawAmount", amount)

    // analytics.track("withdraw.max-selected", {
    //   account: address,
    //   amount,
    // })
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

    // analytics.track("withdraw.started", analyticsData)

    const amtInWei = ethers.utils.parseUnits(`${withdrawAmount}`, 18)
    const tx = await cellarSigner?.redeem(amtInWei, address, address)

    function onSuccess() {
      analytics.track("withdraw.succeeded", analyticsData)
      onClose() // Close modal after successful withdraw.
    }

    function onError(error: Error) {
      analytics.track("withdraw.failed", {
        ...analyticsData,
        error: error.name,
        message: error.message,
      })
    }

    await doHandleTransaction({
      cellarConfig,
      ...tx,
      onSuccess,
      onError,
    })

    refetch()

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
        Unstake
      </BaseButton>
    </VStack>
  )
}

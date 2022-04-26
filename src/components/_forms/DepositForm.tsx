import { useState, VFC } from "react"
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
import { ModalMenu } from "components/_menus/ModalMenu"
import { Token } from "data/tokenConfig"

interface FormValues {
  depositAmount: number
  selectedToken: Token
}

export const DepositForm: VFC = () => {
  const methods = useForm<FormValues>()
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted },
  } = methods
  const [data, setData] = useState<any>()
  const watchDepositAmount = watch("depositAmount")
  const isDisabled =
    isNaN(watchDepositAmount) || watchDepositAmount <= 0
  const isError = errors.depositAmount
  const setMax = () => setValue("depositAmount", 100000)

  return (
    <FormProvider {...methods}>
      <VStack
        as="form"
        spacing={8}
        align="stretch"
        onSubmit={handleSubmit((data) => {
          setData(data)
          console.log({ data })
        })}
      >
        <FormControl>
          <ModalMenu />
        </FormControl>
        <VStack align="flex-start">
          <CardHeading>available</CardHeading>
          <Text as="span">---</Text>
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
              color="black"
              bg="energyYellow"
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
          Deposit Liquidity
        </BaseButton>
      </VStack>
    </FormProvider>
  )
}

import { useState, VFC } from "react"
import {
  FormControl,
  FormErrorMessage,
  Icon,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react"
import { useForm } from "react-hook-form"
import { BaseButton } from "components/_buttons/BaseButton"
import { AiOutlineInfo } from "react-icons/ai"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { ModalInput } from "components/_inputs/ModalInput"

interface FormValues {
  unbondAmount: number
}

export const UnbondForm: VFC = () => {
  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>()
  const [data, setData] = useState<any>()
  const watchUnbondAmount = watch("unbondAmount")
  const isDisabled =
    isNaN(watchUnbondAmount) || watchUnbondAmount <= 0
  const isError = errors.unbondAmount
  const setMax = () => setValue("unbondAmount", 100000)

  // need to do something meaningful with this data
  console.log({ data })

  return (
    <VStack
      as="form"
      spacing={8}
      align="stretch"
      onSubmit={handleSubmit((data) => setData(data))}
    >
      <FormControl isInvalid={isError as boolean | undefined}>
        <InputGroup display="flex" alignItems="center">
          <ModalInput
            type="number"
            step="any"
            {...register("unbondAmount", {
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
        <FormErrorMessage color="orange.base">
          <Icon
            p={0.5}
            mr={1}
            color="surface.bg"
            bg="red.base"
            borderRadius="50%"
            as={AiOutlineInfo}
          />{" "}
          {errors.unbondAmount?.message}
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
        Unbond Liquidity
      </BaseButton>
    </VStack>
  )
}

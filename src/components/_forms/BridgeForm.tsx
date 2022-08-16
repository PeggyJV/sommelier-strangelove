import { Stack, Center, Text, FormControl } from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { InputSommelierAddress } from "components/_cards/BridgeCard/InputSommelierAddress"
import { TimerIcon } from "components/_icons"
import { VFC } from "react"
import { useFormContext } from "react-hook-form"

export const BridgeForm: VFC = () => {
  const { watch, handleSubmit, formState, getFieldState } =
    useFormContext()

  const onSubmit = () => {}
  const watchAmount = watch("amount")
  const watchSommelierAddress = watch("sommelierAddress")

  const isDisabled =
    isNaN(watchAmount) ||
    watchAmount <= 0 ||
    !!getFieldState("amount").error ||
    !!getFieldState("sommelierAddress").error ||
    !watchSommelierAddress

  return (
    <Stack spacing="40px" as="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        <FormControl
          isInvalid={
            formState.errors.sommelierAddress as boolean | undefined
          }
        >
          <InputAmount />
        </FormControl>
        <EthereumAddress />
        <FormControl
          isInvalid={
            formState.errors.sommelierAddress as boolean | undefined
          }
        >
          <InputSommelierAddress />
        </FormControl>
      </Stack>
      <BaseButton
        disabled={isDisabled}
        type="submit"
        height="69px"
        fontSize="21px"
      >
        Bridge $SOMM
      </BaseButton>
      <Center>
        <TimerIcon color="orange.base" boxSize="12px" mr="6px" />
        <Text
          fontSize="xs"
          fontWeight="semibold"
          color="orange.light"
        >
          Transaction should process within 10-15 minutes.
        </Text>
      </Center>
    </Stack>
  )
}

import {
  Stack,
  Center,
  Text,
  FormControl,
  IconButton,
  Image,
  Flex,
  HStack,
} from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { BridgeFormValues } from "components/_cards/BridgeCard"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { InputSommelierAddress } from "components/_cards/BridgeCard/InputSommelierAddress"
import { TimerIcon } from "components/_icons"
import { useBridgeTransaction } from "hooks/web3/useBridgeTransaction"
import { VFC } from "react"
import { useFormContext } from "react-hook-form"

export const BridgeForm: VFC = () => {
  const { watch, handleSubmit, formState, getFieldState } =
    useFormContext<BridgeFormValues>()

  const watchAmount = watch("amount")
  const watchSommelierAddress = watch("sommelierAddress")

  const { isLoading, doTransaction } = useBridgeTransaction()

  const isDisabled =
    isNaN(watchAmount) ||
    watchAmount <= 0 ||
    !!getFieldState("amount").error ||
    !!getFieldState("sommelierAddress").error ||
    !watchSommelierAddress ||
    isLoading

  return (
    <Stack
      spacing="40px"
      as="form"
      onSubmit={handleSubmit(doTransaction)}
    >
      <Stack spacing={6}>
        <HStack justifyContent="space-between">
          <Stack flex={1}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              From
            </Text>
            <HStack
              borderRadius="16px"
              borderWidth="1px"
              borderColor="neutral.600"
              p={2}
              px={4}
            >
              <Image
                src="/assets/icons/eth.png"
                alt="eth"
                w="16px"
                h="16px"
              />
              <Text fontWeight="bold">Ethereum</Text>
            </HStack>
          </Stack>
          <Flex justifyContent={"center"} alignSelf="flex-end" pb={2}>
            <IconButton
              aria-label="swap icon"
              variant="unstyled"
              size="sm"
              icon={
                <Image
                  src="/assets/images/swap.svg"
                  alt="swap icon"
                />
              }
            />
          </Flex>

          <Stack flex={1}>
            <Text fontWeight="bold" color="neutral.400" fontSize="xs">
              To
            </Text>
            <HStack
              borderRadius="16px"
              borderWidth="1px"
              borderColor="neutral.600"
              p={2}
              px={4}
            >
              <Image
                src="/assets/images/coin.png"
                alt="eth"
                w="16px"
                h="16px"
              />
              <Text fontWeight="bold">Sommelier</Text>
            </HStack>
          </Stack>
        </HStack>
        <FormControl
          isInvalid={formState.errors.amount as boolean | undefined}
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
        isLoading={isLoading}
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

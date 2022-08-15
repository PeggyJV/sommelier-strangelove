import { Stack, Center, Text } from "@chakra-ui/react"
import { BaseButton } from "components/_buttons/BaseButton"
import { EthereumAddress } from "components/_cards/BridgeCard/EthereumAddress"
import { InputAmount } from "components/_cards/BridgeCard/InputAmount"
import { InputCosmosAddress } from "components/_cards/BridgeCard/InputCosmosAddress"
import { TimerIcon } from "components/_icons"
import { VFC } from "react"

export const BridgeForm: VFC = () => {
  return (
    <Stack spacing="40px">
      <Stack spacing={6}>
        <InputAmount />
        <EthereumAddress />
        <InputCosmosAddress />
      </Stack>
      <BaseButton height="69px" fontSize="21px" disabled>
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

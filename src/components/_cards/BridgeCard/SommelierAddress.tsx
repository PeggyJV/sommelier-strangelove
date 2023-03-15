import {
  Stack,
  Flex,
  Text,
  Spinner,
  HStack,
  Button,
} from "@chakra-ui/react"
import React from "react"
import { useAccount, useDisconnect } from "graz"

export const SommelierAddress: React.FC = () => {
  const { data, isConnecting, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  return (
    <Stack spacing={2}>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="neutral.400" fontSize="xs">
          Sommelier Address
        </Text>
        {isConnected && (
          <Button
            size="xs"
            px={4}
            variant="outline"
            onClick={() => disconnect()}
          >
            Disconnect
          </Button>
        )}
      </HStack>
      <Flex
        backgroundColor="surface.tertiary"
        justifyContent="center"
        borderRadius={16}
        px={4}
        height="64px"
        alignItems="center"
      >
        {isConnecting ? (
          <Spinner size="xs" />
        ) : (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="neutral.300"
            overflow="auto"
          >
            {data?.bech32Address ||
              "Please connect your Cosmos Wallet"}
          </Text>
        )}
      </Flex>
    </Stack>
  )
}

import { Stack, Flex, Text, Spinner } from "@chakra-ui/react"
import React from "react"
import { useAccount } from "wagmi"

export const EthereumAddress: React.FC = () => {
  const { address, isConnecting } = useAccount()
  return (
    <Stack spacing={2}>
      <Text fontWeight="bold" color="neutral.400" fontSize="xs">
        Ethereum Address
      </Text>
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
            {address || "--"}
          </Text>
        )}
      </Flex>
    </Stack>
  )
}

import { Stack, Flex, Text } from "@chakra-ui/react"
import React from "react"

export const EthereumAddress: React.FC = () => (
  <Stack spacing={2}>
    <Text fontWeight="bold" color="neutral.400" fontSize="xs">
      Ethereum Address
    </Text>
    <Flex
      backgroundColor="surface.tertiary"
      justifyContent="space-between"
      borderRadius={16}
      px={4}
      height="64px"
      alignItems="center"
    >
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="neutral.300"
        overflow="auto"
      >
        0x91BcAACf3A997E467c8A16Fb8C56a80413d0C207
      </Text>
    </Flex>
  </Stack>
)

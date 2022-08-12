import {
  Stack,
  Input,
  Text,
  HStack,
  InputProps,
} from "@chakra-ui/react"
import { InformationIcon } from "components/_icons"
import React from "react"

export const InputCosmosAddress: React.FC<InputProps> = ({
  children,
  ...rest
}) => (
  <Stack spacing={2}>
    <Text fontWeight="bold" color="neutral.400" fontSize="xs">
      Cosmos Address
    </Text>
    <Input
      placeholder="Enter Cosmos address"
      fontSize="xs"
      fontWeight={700}
      boxShadow="0 0 0 2px #F0A64A"
      variant="unstyled"
      borderRadius="16px"
      px={4}
      py={6}
      maxH="64px"
      _placeholder={{
        fontSize: "lg",
      }}
      {...rest}
    />
    <HStack spacing="6px">
      <InformationIcon color="orange.base" boxSize="12px" />
      <Text fontSize="xs" fontWeight="semibold" color="orange.light">
        You need to have a Cosmos wallet to bridge SOMM from Ethereum
        Mainnet to Cosmos.
      </Text>
    </HStack>
  </Stack>
)

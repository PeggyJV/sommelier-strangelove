import {
  Stack,
  HStack,
  VStack,
  Input,
  Button,
  Text,
  InputProps,
} from "@chakra-ui/react"
import React from "react"

import Image from "next/image"
export const InputAmount: React.FC<InputProps> = ({
  children,
  ...rest
}) => {
  return (
    <Stack spacing={2}>
      <Text fontWeight="bold" color="neutral.400" fontSize="xs">
        Enter Amount
      </Text>
      <HStack
        backgroundColor="surface.tertiary"
        justifyContent="space-between"
        borderRadius={16}
        boxShadow="purpleOutline1"
        px={4}
        py={3}
        height="64px"
      >
        <HStack>
          <Image
            width="16px"
            height="16px"
            src="/assets/images/coin.png"
            alt="coin logo big"
          />
          <Text fontWeight="semibold">SOMM</Text>
        </HStack>

        <VStack spacing={0} align="flex-end">
          <Input
            variant="unstyled"
            pr="2"
            type="number"
            step="any"
            defaultValue="0.00"
            placeholder="0.00"
            fontSize="lg"
            fontWeight={700}
            textAlign="right"
            {...rest}
          />
          <HStack spacing={0} fontSize="10px">
            <Text as="span">Available: 0.00</Text>
            <Button
              variant="unstyled"
              p={0}
              w="max-content"
              h="max-content"
              textTransform="uppercase"
              fontSize="inherit"
              fontWeight={600}
            >
              max
            </Button>
          </HStack>
        </VStack>
      </HStack>
    </Stack>
  )
}

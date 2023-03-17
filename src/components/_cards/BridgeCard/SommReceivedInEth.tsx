import { Stack, Text, HStack } from "@chakra-ui/react"
import React from "react"
import { useFormContext } from "react-hook-form"
import { BridgeFormValues } from "."

export const SommReceivedInEth: React.FC = () => {
  const { watch } = useFormContext<BridgeFormValues>()

  const bridgeFee = 50
  const amount = watch("amount")
  const receivedAmount = amount - bridgeFee
  return (
    <Stack spacing={2}>
      <Text color="neutral.300" fontWeight="bold" fontSize="xs">
        SOMM Received in ETH
      </Text>
      <Stack>
        <HStack justifyContent="space-between">
          <Text color="neutral.300" fontSize="xs">
            Amount
          </Text>
          <Text fontWeight="bold" color="neutral.400" fontSize="xs">
            {amount} SOMM
          </Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text color="neutral.300" fontSize="xs">
            Bridge Fee
          </Text>
          <Text fontWeight="bold" color="neutral.400" fontSize="xs">
            -{bridgeFee} SOMM
          </Text>
        </HStack>
        {amount > 50 && (
          <HStack justifyContent="space-between">
            <Text color="neutral.300" fontSize="xs">
              Amount Received in ETH
            </Text>
            <Text fontWeight="bold" color="neutral.200" fontSize="xs">
              {receivedAmount} SOMM
            </Text>
          </HStack>
        )}
      </Stack>
    </Stack>
  )
}

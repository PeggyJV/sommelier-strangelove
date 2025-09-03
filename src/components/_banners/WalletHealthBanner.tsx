import React from "react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  Text,
} from "@chakra-ui/react"
import { useWalletHealth } from "hooks/useWalletHealth"

export function WalletHealthBanner() {
  const { healthy, issues } = useWalletHealth()

  // Only show in development and when there are issues
  if (process.env.NODE_ENV === "production" || healthy) {
    return null
  }

  return (
    <Alert
      status="warning"
      variant="subtle"
      flexDirection="column"
      alignItems="flex-start"
      p={4}
    >
      <AlertIcon />
      <VStack align="flex-start" spacing={2}>
        <AlertTitle>Wallet Configuration Issues</AlertTitle>
        <AlertDescription>
          <VStack align="flex-start" spacing={1}>
            {issues.map((issue, index) => (
              <Text key={index} fontSize="sm">
                • {issue}
              </Text>
            ))}
          </VStack>
        </AlertDescription>
      </VStack>
    </Alert>
  )
}

import React, { useState } from "react"
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Code,
  Collapse,
  useDisclosure,
} from "@chakra-ui/react"
import { getProviderDebugInfo } from "utils/wallet/conflictResolver"
import {
  clearPendingWalletRequests,
  forceClearWalletState,
} from "utils/wallet/initOnce"

export const WalletDebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const { isOpen, onToggle } = useDisclosure()

  const refreshDebugInfo = () => {
    const info = getProviderDebugInfo()
    setDebugInfo(info)
  }

  const clearWalletState = () => {
    clearPendingWalletRequests()
    forceClearWalletState()
    refreshDebugInfo()
  }

  return (
    <Box
      p={4}
      borderWidth={1}
      borderColor="gray.200"
      borderRadius="md"
    >
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold" fontSize="sm">
          Wallet Debug Info
        </Text>
        <Button size="xs" onClick={onToggle}>
          {isOpen ? "Hide" : "Show"}
        </Button>
      </HStack>

      <Collapse in={isOpen}>
        <VStack spacing={2} align="stretch">
          <HStack spacing={2}>
            <Button size="xs" onClick={refreshDebugInfo}>
              Refresh
            </Button>
            <Button
              size="xs"
              onClick={clearWalletState}
              colorScheme="red"
            >
              Clear State
            </Button>
          </HStack>

          {debugInfo && (
            <Box p={2} bg="gray.50" borderRadius="md">
              <Code fontSize="xs" whiteSpace="pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </Code>
            </Box>
          )}
        </VStack>
      </Collapse>
    </Box>
  )
}

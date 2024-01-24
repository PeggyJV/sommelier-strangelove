import { Chain, ChainType } from "data/chainConfig"
import { useAccount as wagmiUseAccount } from "wagmi"
import { useDisconnect, useAccount as grazUseAccount } from "graz"
import { Button, Flex, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import React from "react"

export const Address = ({ chain }: { chain: Chain}) => {

  const { address: wagmiAddress, isConnecting: wagmiIsConnecting } = wagmiUseAccount();
  const { data: grazData, isConnecting: grazIsConnecting, isConnected: grazIsConnected } = grazUseAccount();

  const { disconnect } = useDisconnect()

  if(chain.type === ChainType.Ethereum) {
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
          {wagmiIsConnecting ? (
            <Spinner size="xs" />
          ) : (
            <Text
              fontSize="xs"
              fontWeight="semibold"
              color="neutral.300"
              overflow="auto"
            >
              {wagmiAddress || "Please connect your Ethereum Wallet"}
            </Text>
          )}
        </Flex>
      </Stack>
    )
  }
  else {
    return (
      <Stack spacing={2}>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="neutral.400" fontSize="xs">
          Sommelier Address
        </Text>
        {grazIsConnected && (
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
        {grazIsConnecting ? (
          <Spinner size="xs" />
        ) : (
          <Text
            fontSize="xs"
            fontWeight="semibold"
            color="neutral.300"
            overflow="auto"
          >
            {grazData?.bech32Address ||
              "Please connect your Cosmos Wallet"}
          </Text>
        )}
      </Flex>
    </Stack>
    )
  }
}

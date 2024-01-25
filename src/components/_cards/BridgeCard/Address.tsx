import { Chain, ChainType } from "data/chainConfig"
import { useAccount as wagmiUseAccount } from "wagmi"
import { useAccount as grazUseAccount, useDisconnect } from "graz"
import { Button, Flex, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import React, { FC } from "react"

interface AddressProps {
  chain : Chain
}
export const Address: FC<AddressProps> = ({ chain }) => {

  const { address: wagmiAddress, isConnecting: wagmiIsConnecting } = wagmiUseAccount();

  const { data: grazData, isConnecting: grazIsConnecting, isConnected: grazIsConnected } = grazUseAccount();
  const { disconnect } = useDisconnect();

  const isConnecting = chain.type === ChainType.Ethereum ? wagmiIsConnecting : grazIsConnecting;

  const ConnectInfo = () => {
    let text;
    if(chain.type === ChainType.Cosmos){
      text = grazData?.bech32Address ?? "Please connect your Cosmos Wallet";
    }
    else if(chain.type === ChainType.Ethereum){
      text = wagmiAddress ?? "Please connect your Ethereum Wallet"
    }
    else{
      text = "TODO: L2address ?? Please connect L2 wallet"
    }
    return (
      <Text
        fontSize="xs"
        fontWeight="semibold"
        color="neutral.300"
        overflow="auto"
      >
        {text}
    </Text>
    )
  }
  return (
      <Stack spacing={2}>
      <HStack justifyContent="space-between">
        <Text fontWeight="bold" color="neutral.400" fontSize="xs">
          {chain.displayName} Address
        </Text>
        {grazIsConnected
          && chain.type === ChainType.Cosmos
          && (
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
          <ConnectInfo />
        )}
      </Flex>
    </Stack>
    )
}

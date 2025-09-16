import * as React from "react"
import { ButtonProps, HStack } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import ChainButton from "../ChainButton"
import {
  chainConfig,
  chainConfigMap,
  getChainByViemId,
} from "src/data/chainConfig"

export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  unstyled?: boolean
  children?: React.ReactNode
  overridechainid?: string
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { isConnected, chain: viemChain } = useAccount()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")
  const chain = getChainByViemId(viemChain?.name)

  // Use the actual current chain from wallet, fallback to default if not connected
  const currentChainId = chain?.id || "ethereum"

  // Ensure we have a valid chain config
  const currentChainConfig =
    chainConfigMap[currentChainId] || chainConfigMap["ethereum"]

  const handleNetworkChange = (chainId: string) => {
    // This will be handled by the ChainButton component
  }

  // For connect buttons that are not on header/should allow chain selection
  if (props.overridechainid) {
    const chain = chainConfigMap[props.overridechainid]
    return (
      <ClientOnly>
        <HStack
          w="full"
          maxW="100%"
          spacing={{ base: 2, md: "1.5em" }}
        >
          {isConnected ? (
            <ConnectedPopover />
          ) : (
            <ConnectWalletPopover
              wagmiChainId={chain.wagmiId}
              width="auto"
              minH="44px"
              {...props}
            />
          )}
        </HStack>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <HStack spacing={{ base: 2, md: "1.5em" }} w="full" maxW="100%">
        <HStack flexShrink={0} minW={{ base: "auto", md: "auto" }}>
          <ChainButton
            chain={currentChainConfig}
            onChainChange={handleNetworkChange}
          />
        </HStack>

        {isConnected ? (
          <HStack
            flex={1}
            minW={0}
            maxW={{ base: "60%", md: "100%" }}
          >
            <ConnectedPopover />
          </HStack>
        ) : (
          <HStack
            flex={1}
            minW={0}
            maxW={{ base: "60%", md: "100%" }}
          >
            <ConnectWalletPopover
              wagmiChainId={currentChainConfig.wagmiId}
              width="auto"
              minH="44px"
              {...props}
            />
          </HStack>
        )}
      </HStack>
    </ClientOnly>
  )
}

export default ConnectButton

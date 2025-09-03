import * as React from "react"
import { ButtonProps, HStack } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { MobileConnectedPopover } from "./MobileConnectedPopover"
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
        <HStack w="100%">
          {isConnected ? (
            isLarger992 ? (
              <ConnectedPopover />
            ) : (
              <MobileConnectedPopover />
            )
          ) : (
            <ConnectWalletPopover
              wagmiChainId={chain.wagmiId}
              {...props}
            />
          )}
        </HStack>
      </ClientOnly>
    )
  }

  return (
    <ClientOnly>
      <HStack spacing={"1.5em"}>
        <ChainButton
          chain={currentChainConfig}
          onChainChange={handleNetworkChange}
        />

        {isConnected ? (
          isLarger992 ? (
            <ConnectedPopover />
          ) : (
            <MobileConnectedPopover />
          )
        ) : (
          <ConnectWalletPopover
            wagmiChainId={currentChainConfig.wagmiId}
            {...props}
          />
        )}
      </HStack>
    </ClientOnly>
  )
}

export default ConnectButton

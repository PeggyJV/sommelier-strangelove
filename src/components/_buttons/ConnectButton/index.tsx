// src/components/_buttons/ConnectButton/index.tsx
import * as React from "react"
import { ButtonProps, HStack } from "@chakra-ui/react"
import { useAccount, useNetwork, useConnect } from "wagmi"
import { InjectedConnector } from "wagmi/connectors/injected"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { MobileConnectedPopover } from "./MobileConnectedPopover"
import ChainButton from "../ChainButton"
import { chainConfigMap } from "src/data/chainConfig"

export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  unstyled?: boolean
  children?: React.ReactNode
  overrideChainId?: string
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { isConnected } = useAccount()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")
  const { chain } = useNetwork()
  const [selectedNetwork, setSelectedNetwork] = React.useState(
    chain?.name.toLowerCase().split(" ")[0] || "ethereum"
  )

  // In this example, Trust Wallet is considered alongside other wallets like MetaMask
  // under the same injected provider category by wagmi's useConnect with InjectedConnector.
  // Adjustments will mainly be in the ConnectWalletPopover to present Trust Wallet as an option.
  const { connect } = useConnect({
    connector: new InjectedConnector({
      chains: [chainConfigMap[selectedNetwork].wagmiId],
    }),
  })

  const handleNetworkChange = (chainId: string) => {
    setSelectedNetwork(chainId)
  }

  if (props.overrideChainId) {
    const chain = chainConfigMap[props.overrideChainId]
    return (
      <ClientOnly>
        <HStack>
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
          chain={chainConfigMap[selectedNetwork]}
          onChainChange={handleNetworkChange}
        />
        {isConnected ? (
          isLarger992 ? (
            <ConnectedPopover />
          ) : (
            <MobileConnectedPopover />
          )
        ) : (
          // This is where you provide users the option to connect their wallets,
          // including Trust Wallet through the generic InjectedConnector
          <ConnectWalletPopover
            wagmiChainId={chainConfigMap[selectedNetwork].wagmiId}
            {...props}
          />
        )}
      </HStack>
    </ClientOnly>
  )
}

export default ConnectButton

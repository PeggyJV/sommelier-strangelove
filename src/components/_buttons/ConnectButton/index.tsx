import * as React from "react"
import { ButtonProps, HStack } from "@chakra-ui/react"
import { useAccount } from "wagmi"
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
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { isConnected } = useAccount()
  const isLarger992 = useBetterMediaQuery("(min-width: 992px)")
  const [selectedNetwork, setSelectedNetwork] =
    React.useState("ethereum")

  const handleNetworkChange = (chainId: string) => {
    setSelectedNetwork(chainId)
    // TODO: Add any additional logic needed when changing the network.
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
          <ConnectWalletPopover {...props} />
        )}
      </HStack>
    </ClientOnly>
  )
}

export default ConnectButton

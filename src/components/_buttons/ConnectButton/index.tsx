import * as React from "react"
import { ButtonProps } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  unstyled?: boolean
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { isConnected } = useAccount()

  return (
    <ClientOnly>
      {isConnected ? (
        isConnected && <ConnectedPopover />
      ) : (
        <ConnectWalletPopover {...props} />
      )}
    </ClientOnly>
  )
}

export default ConnectButton

import * as React from "react"
import { ButtonProps } from "@chakra-ui/react"
import { useAccount } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { ConnectWalletPopover } from "./ConnectWalletPopover"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { MobileConnectedPopover } from "./MobileConnectedPopover"
export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  unstyled?: boolean
}

const ConnectButton = (props: ConnectButtonProps) => {
  const { isConnected } = useAccount()
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  return (
    <ClientOnly>
      {isConnected ? (
        isLarger768 ? (
          <ConnectedPopover />
        ) : (
          <MobileConnectedPopover />
        )
      ) : (
        <ConnectWalletPopover {...props} />
      )}
    </ClientOnly>
  )
}

export default ConnectButton

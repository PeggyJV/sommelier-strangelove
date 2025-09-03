import React, { memo } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ConnectButtonProps } from "."
import { Button } from "@chakra-ui/react"
import { useWalletConnection } from "hooks/web3/useWalletConnection"

type ConnectWalletPopoverProps = ConnectButtonProps & {
  wagmiChainId?: number
}

export const ConnectWalletPopover = memo(
  ({
    unstyled,
    children,
    wagmiChainId,
    ...rest
  }: ConnectWalletPopoverProps) => {
    const { isConnecting, cancelConnection } = useWalletConnection()

    // If connecting, show cancel button
    if (isConnecting) {
      return (
        <Button
          onClick={cancelConnection}
          colorScheme="red"
          variant="outline"
          size="sm"
          {...rest}
        >
          Cancel Connection
        </Button>
      )
    }

    return (
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          return (
            <Button
              onClick={openConnectModal}
              variant="sommOutline"
              w={rest.w || rest.width || "100%"}
              minH={rest.minH || "48px"}
              {...rest}
            >
              {(children as string) || "Connect Wallet"}
            </Button>
          )
        }}
      </ConnectButton.Custom>
    )
  }
)

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
          const isAlreadyConnected = Boolean(account?.address)
          const handleClick = () => {
            if (isAlreadyConnected) {
              // If already connected, open the account modal instead of attempting to connect again
              openAccountModal?.()
              return
            }
            openConnectModal?.()
          }
          return (
            <Button
              onClick={handleClick}
              variant="sommOutline"
              w={rest.w || rest.width || "100%"}
              minH={(rest as any).minH || "48px"}
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

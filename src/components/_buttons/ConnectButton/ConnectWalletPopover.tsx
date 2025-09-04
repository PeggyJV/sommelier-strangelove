import React, { memo } from "react"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ConnectButtonProps } from "."
import { Button as UIBtn } from "components/ui/Button"
import { Button as CkButton, Text, HStack } from "@chakra-ui/react"
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
        <UIBtn
          onClick={cancelConnection}
          variant="danger"
          size="md"
          w={{ base: "100%", md: "auto" }}
          {...rest}
        >
          Cancel Connection
        </UIBtn>
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
            <CkButton
              onClick={openConnectModal}
              bg="surface.bg"
              borderWidth={2}
              borderColor="purple.base"
              borderRadius="full"
              w="auto"
              fontFamily="Haffer"
              fontSize={12}
              px={3}
              h={"36px"}
              _hover={{ bg: "purple.dark" }}
              _active={{
                bg: "purple.dark",
                transform: "translateY(0)",
              }}
              _focusVisible={{
                boxShadow:
                  "0 0 0 3px var(--chakra-colors-purple-base)",
              }}
              {...rest}
            >
              <Text fontWeight="semibold">
                {(children as string) || "Connect Wallet"}
              </Text>
            </CkButton>
          )
        }}
      </ConnectButton.Custom>
    )
  }
)

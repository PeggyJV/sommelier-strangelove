import * as React from "react"
import {
  ButtonProps,
  useDisclosure,
  useToast,
} from "@chakra-ui/react"
import { Connector, useAccount, useConnect } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { BaseButton, BaseButtonProps } from "../BaseButton"
import { MoneyWalletIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { SelectWalletModal } from "./SelectWalletModal"
export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  connector?: Connector
  unstyled?: boolean
}

const ConnectButton = ({
  connector: c,
  unstyled,
  ...rest
}: ConnectButtonProps) => {
  const toast = useToast()

  const { isConnected, address, isConnecting } = useAccount()
  const { onClose, isOpen, onOpen } = useDisclosure()

  /**
   * - If connector is ready (window.ethereum exists), it'll detect the connector
   *   color scheme and attempt to connect on click.
   *
   * - If connector is not ready (window.ethereum does not exist), it'll render
   *   as an anchor and opens MetaMask download page in a new tab
   */
  const conditionalProps = React.useMemo<ButtonProps>(() => {
    return !isConnected
      ? // connector ready props
        {
          onClick: () => {
            analytics.track("wallet.connect-started")
            onOpen()
            // connect({
            //   connector: c,
            // })
          },
        }
      : // connector not ready props
        {
          as: "a",
          href: "https://metamask.io/download",
          target: "_blank",
        }
  }, [isConnected, onOpen])

  React.useEffect(() => {
    if (isConnected) onClose()
  }, [isConnected, onClose])

  // Pass custom connect button styles if unstyled prop is not passed to component
  const styles: BaseButtonProps | false = !unstyled && {
    p: 3,
    bg: "surface.primary",
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "surface.secondary",
    minW: "max-content",
    fontFamily: "Haffer",
    fontSize: 12,
    icon: MoneyWalletIcon,
    iconProps: {
      bgColor: "unset",
      borderRadius: "unset",
      _groupHover: {
        bgColor: "unset",
      },
    },
    _hover: {
      bg: "purple.dark",
      borderColor: "surface.tertiary",
    },
  }

  return (
    <ClientOnly>
      <SelectWalletModal isOpen={isOpen} onClose={onClose} />
      {isConnected ? (
        isConnected && <ConnectedPopover />
      ) : (
        <BaseButton
          isLoading={isConnecting}
          // key={c.id}
          {...styles}
          {...conditionalProps}
          {...rest}
        >
          Connect Wallet
        </BaseButton>
      )}
    </ClientOnly>
  )
}

export default ConnectButton

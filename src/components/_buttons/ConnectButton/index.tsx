import * as React from "react"
import { ButtonProps, useToast } from "@chakra-ui/react"
import { Connector, useAccount, useConnect } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { BaseButton, BaseButtonProps } from "../BaseButton"
import { MoneyWalletIcon } from "components/_icons"
import { analytics } from "utils/analytics"
import { useGeo } from "context/geoContext"

export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  connector: Connector
  unstyled?: boolean
}

const ConnectButton = ({
  connector: c,
  unstyled,
  ...rest
}: ConnectButtonProps) => {
  const { isRestricted } = useGeo() || {}

  const toast = useToast()

  const { isConnected, address, isConnecting } = useAccount()
  const { connect } = useConnect({
    onError: (error) => {
      toast({
        title: "Connection failed!",
        description: error.message,
        status: "error",
        isClosable: true,
      })

      analytics.track("wallet.connect-failed", {
        error: error.name,
        message: error.message,
      })
    },
    onSuccess: (data) => {
      const { account } = data

      if (account && account.length) {
        analytics.track("wallet.connect-succeeded", {
          account,
        })

        analytics.identify(account)
      }
    },
  })

  /**
   * - If connector is ready (window.ethereum exists), it'll detect the connector
   *   color scheme and attempt to connect on click.
   *
   * - If connector is not ready (window.ethereum does not exist), it'll render
   *   as an anchor and opens MetaMask download page in a new tab
   */
  const conditionalProps = React.useMemo<ButtonProps>(() => {
    return c.ready
      ? // connector ready props
        {
          onClick: () => {
            analytics.track("wallet.connect-started")
            connect({
              connector: c,
            })
          },
        }
      : // connector not ready props
        {
          as: "a",
          href: "https://metamask.io/download",
          target: "_blank",
        }
  }, [c, connect])

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
      {isConnected ? (
        isConnected && <ConnectedPopover />
      ) : (
        <BaseButton
          isLoading={isConnecting}
          key={c.id}
          disabled={isRestricted}
          {...styles}
          {...conditionalProps}
          {...rest}
        >
          {isRestricted
            ? `Unable to connect`
            : c.ready
            ? `Connect Wallet`
            : `Connect Wallet`}
        </BaseButton>
      )}
    </ClientOnly>
  )
}

export default ConnectButton

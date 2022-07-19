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

  const [account] = useAccount({
    fetchEns: true,
  })
  const [{ error, loading, data }, connect] = useConnect()
  const toast = useToast()
  const isConnected = data.connected

  // on wallet connect error
  React.useEffect(() => {
    if (error) {
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
    }
  }, [error, toast])

  // on wallet connect succes, must be separate from previous useEffect
  React.useEffect(() => {
    if (isConnected) {
      analytics.track("wallet.connect-succeeded", {
        account: account?.data?.address,
      })
    }
  }, [isConnected, account?.data?.address])

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
            connect(c)
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
    fontFamily: "SF Mono",
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
        account.data && <ConnectedPopover />
      ) : (
        <BaseButton
          isLoading={loading}
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
            : `Please install MetaMask`}
        </BaseButton>
      )}
    </ClientOnly>
  )
}

export default ConnectButton

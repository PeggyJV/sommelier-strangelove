import * as React from "react"
import { ButtonProps, useToast } from "@chakra-ui/react"
import { Connector, useAccount, useConnect } from "wagmi"
import ClientOnly from "components/ClientOnly"
import { ConnectedPopover } from "./ConnectedPopover"
import { BaseButton } from "../BaseButton"
import { MoneyWalletIcon } from "components/_icons"
import { analytics } from "utils/analytics"

export interface ConnectButtonProps
  extends Omit<ButtonProps, "children"> {
  connector: Connector
}

const ConnectButton = ({
  connector: c,
  ...rest
}: ConnectButtonProps) => {
  const [account] = useAccount({
    fetchEns: true,
  })
  const [{ error, loading, data }, connect] = useConnect()
  const toast = useToast()
  const isConnected = data.connected

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Connection failed!",
        description: error.message,
        status: "error",
        isClosable: true,
      })
    }
  }, [error, toast])

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
            analytics.track("wallet.connect-start")
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

  return (
    <ClientOnly>
      {isConnected ? (
        account.data && <ConnectedPopover />
      ) : (
        <BaseButton
          isLoading={loading}
          key={c.id}
          p={3}
          bg="surface.primary"
          borderWidth={1}
          borderRadius={12}
          borderColor="surface.secondary"
          minW="max-content"
          icon={MoneyWalletIcon}
          iconProps={{
            bgColor: "unset",
            borderRadius: "unset",
            _groupHover: {
              bgColor: "unset",
            },
          }}
          _hover={{
            bg: "purple.dark",
            borderColor: "surface.tertiary",
          }}
          {...conditionalProps}
          {...rest}
        >
          {c.ready ? `Connect Wallet` : `Please install MetaMask`}
        </BaseButton>
      )}
    </ClientOnly>
  )
}

export default ConnectButton

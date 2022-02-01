import * as React from 'react'
import { Box, Button, ButtonProps, Popover, useToast } from '@chakra-ui/react'
import { Connector, useAccount, useConnect } from 'wagmi'
import ClientOnly from 'components/ClientOnly'
import { getConnectorScheme } from 'src/utils/chakra'

export interface ConnectButtonProps extends Omit<ButtonProps, 'children'> {
  connector?: Connector
}

const ConnectButton = ({
  connector: _connector,
  ...rest
}: ConnectButtonProps) => {
  const [account, disconnect] = useAccount({ fetchEns: true })
  const [auth, connect] = useConnect()
  const toast = useToast()

  /**
   * Resolve connector from given props, defaults to injected connector
   */
  const c = _connector ?? auth.data.connectors.find(x => x.id == 'injected')

  const isConnected = account.data?.connector != undefined
  const isReady = c?.ready
  const isLoading = account.loading || auth.loading

  React.useEffect(() => {
    if (auth.error) {
      toast({
        title: 'Connection failed!',
        description: auth.error.message,
        status: 'error',
        isClosable: true
      })
    }
  }, [auth.error, toast])

  /**
   * - If wallet is connected, clicking will disconnect the wallet and attempts
   *   to clear connection.
   *
   * - If connector is ready (window.ethereum exists), it'll detect the connector
   *   color scheme and attempt to connect on click.
   *
   * - If connector is not ready (window.ethereum does not exist), it'll render
   *   as an anchor and opens MetaMask download page in a new tab
   */
  const conditionalProps = React.useMemo<ButtonProps>(() => {
    return isConnected
      ? {
          colorScheme: 'red',
          onClick: disconnect
        }
      : isReady
      ? {
          // connector ready props
          colorScheme: getConnectorScheme(c?.name),
          onClick: () => connect(c)
        }
      : {
          // connector not ready props
          as: 'a',
          colorScheme: 'orange',
          href: 'https://metamask.io/download',
          target: '_blank'
        }
  }, [c, connect, disconnect, isConnected, isReady])

  return (
    <ClientOnly>
      <Button maxW='24ch' isLoading={isLoading} {...conditionalProps} {...rest}>
        <Box as='span' isTruncated>
          {isConnected
            ? 'Disconnect'
            : isReady
            ? `Connect with ${c?.name}`
            : `Please install MetaMask`}
        </Box>
      </Button>
    </ClientOnly>
  )
}

export default ConnectButton

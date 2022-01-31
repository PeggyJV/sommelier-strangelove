import * as React from 'react'
import { Button, ButtonProps, useToast } from '@chakra-ui/react'
import { Connector, useConnect } from 'wagmi'
import ClientOnly from 'components/ClientOnly'
import { getConnectorScheme } from 'src/utils/chakra'

export interface ConnectButtonProps extends Omit<ButtonProps, 'children'> {
  connector: Connector
}

const ConnectButton = ({ connector: c, ...rest }: ConnectButtonProps) => {
  const [{ error, loading }, connect] = useConnect()
  const toast = useToast()

  React.useEffect(() => {
    if (error) {
      toast({
        title: 'Connection failed!',
        description: error.message,
        status: 'error',
        isClosable: true
      })
    }
  }, [error, toast])

  /**
   * Connect to given connector, else, open MetaMask download page
   */
  const handleClick = () =>
    c.ready
      ? connect(c)
      : window.open('https://metamask.io/download/', '_blank')

  /**
   * Resolve button color scheme by detecting known connectors, fallbacks to
   * default color if connector is unknown, and defaults to orange if there
   * are no connectors.
   */
  const colorScheme = c.ready ? getConnectorScheme(c.name) : 'orange'

  return (
    <ClientOnly>
      <Button
        colorScheme={colorScheme}
        isLoading={loading}
        key={c.id}
        onClick={handleClick}
        {...rest}
      >
        Connect with {c.ready ? c.name : 'MetaMask'}
      </Button>
    </ClientOnly>
  )
}

export default ConnectButton

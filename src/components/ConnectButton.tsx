import { useEffect, useMemo } from 'react'
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

  useEffect(() => {
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
   * - If connector is ready (window.ethereum exists), it'll detect the connector
   *   color scheme and attempt to connect on click.
   *
   * - If connector is not ready (window.ethereum does not exist), it'll render
   *   as an anchor and opens MetaMask download page in a new tab
   */
  const conditionalProps = useMemo<ButtonProps>(() => {
    return c.ready
      ? // connector ready props
        {
          colorScheme: getConnectorScheme(c.name),
          onClick: () => connect(c)
        }
      : // connector not ready props
        {
          as: 'a',
          colorScheme: 'orange',
          href: 'https://metamask.io/download',
          target: '_blank'
        }
  }, [c, connect])

  return (
    <ClientOnly>
      <Button isLoading={loading} key={c.id} {...conditionalProps} {...rest}>
        {c.ready ? `Connect with ${c.name}` : `Please install MetaMask`}
      </Button>
    </ClientOnly>
  )
}

export default ConnectButton

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

  return (
    <ClientOnly>
      <Button
        colorScheme={getConnectorScheme(c.name)}
        isDisabled={!c.ready}
        isLoading={loading}
        key={c.id}
        onClick={() => connect(c)}
        {...rest}
      >
        Connect with {c.name}
        {!c.ready && ' (unsupported)'}
      </Button>
    </ClientOnly>
  )
}

export default ConnectButton

import * as Chakra from '@chakra-ui/react'
import { useCosmWasm } from 'hooks/cosmwasm'
import { useEffect, useMemo } from 'react'

export interface KeplrButtonProps extends Omit<Chakra.ButtonProps, 'children'> {
  chainId?: string
  rpcEndpoint?: string
}

const KeplrButton = ({ chainId, rpcEndpoint, ...rest }: KeplrButtonProps) => {
  const cosmwasm = useCosmWasm()
  const toast = Chakra.useToast()

  useEffect(() => {
    if (cosmwasm.error) {
      toast({
        title: 'Connection failed!',
        description: cosmwasm.error.message,
        status: 'error',
        isClosable: true
      })
    }
  }, [cosmwasm.error, toast])

  /**
   * - If Keplr is not installed, it'll render as an anchor and opens Keplr
   *   download page in a new tab.
   *
   * - If wallet is connected, clicking will disconnect the wallet and attempts
   *   to clean signing client.
   *
   * - If wallet is not connected, clicking will attempt to connect with Keplr
   *   and attempt to instantiate signing client. (see {@link useCosmWasm})
   */
  const conditionalProps = useMemo<Chakra.ButtonProps>(() => {
    return cosmwasm.isSupported
      ? {
          // keplr supported props
          onClick: () => {
            if (cosmwasm.walletAddress) {
              cosmwasm.disconnect()
            } else {
              cosmwasm.connect(chainId, rpcEndpoint)
            }
          }
        }
      : {
          // no keplr support props
          as: 'a',
          href: 'https://www.keplr.app',
          target: '_blank'
        }
  }, [chainId, cosmwasm, rpcEndpoint])

  return (
    <Chakra.Button
      colorScheme='purple'
      isDisabled={!cosmwasm.isSupported}
      isLoading={cosmwasm.isLoading}
      {...conditionalProps}
      {...rest}
    >
      {cosmwasm.isSupported
        ? cosmwasm.walletAddress
          ? `Disconnect ${cosmwasm.walletAddress?.slice(0, 8)}...`
          : 'Connect with Keplr'
        : 'Please install Keplr'}
    </Chakra.Button>
  )
}

export default KeplrButton

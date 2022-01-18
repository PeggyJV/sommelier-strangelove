import useEthersProvider from 'hooks/useEthersProvider'
import useEthersSigner from 'hooks/useEthersSigner'
import { createContext, useContext, FC } from 'react'
import { providers } from 'ethers'
import useAddress from 'hooks/useAddress'

interface MetaMaskContext {
  authUser: any
  isLoading: boolean
  address?: string
  provider?: providers.Web3Provider
  signer?: providers.JsonRpcSigner
}

const defaultContext: MetaMaskContext = {
  authUser: null,
  isLoading: true
}

const metaMaskContext = createContext<MetaMaskContext>(defaultContext)

export const MetaMaskProvider: FC = ({ children }) => {
  const address = useAddress()
  const provider = useEthersProvider()
  const signer = useEthersSigner()

  const value: MetaMaskContext = {
    authUser: 'bingus',
    isLoading: false,
    address,
    provider,
    signer
  }

  return (
    <metaMaskContext.Provider value={value}>
      {children}
    </metaMaskContext.Provider>
  )
}

export const useMetaMask = () => useContext(metaMaskContext)

import { createContext, useContext, FC, useEffect, useState } from 'react'
import { providers } from 'ethers'

interface MetaMaskContext {
  ethereum?: providers.ExternalProvider | false
  address?: string
  provider?: providers.Web3Provider
  signer?: providers.JsonRpcSigner
}

const defaultContext: MetaMaskContext = {}

const metaMaskContext = createContext<MetaMaskContext>(defaultContext)

export const MetaMaskProvider: FC = ({ children }) => {
  const [ethereum, setEthereum] = useState<providers.ExternalProvider | false>()
  const [provider, setProvider] = useState<providers.Web3Provider>()
  const [signer, setSigner] = useState<providers.JsonRpcSigner>()
  const [address, setAddress] = useState<string>()

  // we have to use this pattern because the window object is inaccessible on the server.
  useEffect(() => {
    const ethereum = window.ethereum

    if (ethereum) {
      const provider = new providers.Web3Provider(ethereum)
      const signer = provider?.getSigner()
      const getAddress = async () => {
        try {
          const address = await signer?.getAddress()
          setAddress(address)
        } catch (err) {
          console.error("Please verify you're logged in on MetaMask")
        }
      }

      setEthereum(ethereum)
      getAddress()
      setProvider(provider)
      setSigner(signer)
    } else if (ethereum === undefined) {
      setEthereum(false)
    }
  }, [])

  const value: MetaMaskContext = {
    ethereum,
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

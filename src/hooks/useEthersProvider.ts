import { useEffect, useState } from 'react'
import { providers } from 'ethers'

const useEthersProvider = () => {
  const [provider, setProvider] = useState<providers.Web3Provider>()

  useEffect(() => {
    const ethereum = window.ethereum
    if (ethereum) {
      const provider = new providers.Web3Provider(ethereum)

      setProvider(provider)
    }
  }, [])

  return provider
}

export default useEthersProvider

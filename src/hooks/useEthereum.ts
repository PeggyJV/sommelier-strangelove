import { useEffect, useState } from 'react'
import { providers } from 'ethers'

const useEthereum = () => {
  const [eth, setEth] = useState<providers.ExternalProvider>()

  useEffect(() => {
    const ethereum = window.ethereum

    setEth(ethereum)
  }, [])

  return eth
}

export default useEthereum

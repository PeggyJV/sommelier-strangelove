import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const useEthereum = () => {
  const [eth, setEth] = useState<ethers.providers.ExternalProvider>()

  useEffect(() => {
    const ethereum = window.ethereum

    setEth(ethereum)
  }, [])

  return eth
}

export default useEthereum

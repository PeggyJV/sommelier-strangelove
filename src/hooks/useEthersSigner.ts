import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const useEthersSigner = () => {
  const [signer, setSigner] = useState()

  useEffect(() => {
    const ethereum = window.ethereum
    const provider = new ethers.providers.Web3Provider(ethereum)
    const ethSigner = provider.getSigner()

    setSigner(ethSigner)
  }, [])

  return signer
}

export default useEthersSigner

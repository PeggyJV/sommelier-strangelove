import { useState } from 'react'
import useEthereum from 'hooks/useEthereum'

const useWallet = async () => {
  const ethereum = useEthereum()
  if (ethereum) {
    const res = await ethereum.request({ method: 'eth_requestAccounts' })
    const account = res[0]

    return account
  } else {
    console.error('Please install MetaMask')
  }
}

export default useWallet

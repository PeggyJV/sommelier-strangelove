import { useQuery } from 'react-query'
import { ethers } from 'ethers'

const useEthersSigner = () =>
  useQuery('ethers', () => {
    const ethereum = window.ethereum
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = provider.getSigner()

    return signer
  })

export default useEthersSigner

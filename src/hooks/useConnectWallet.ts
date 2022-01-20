import { useMetaMask } from 'context/metaMaskContext'

const useConnectWallet = () => {
  const { ethereum } = useMetaMask()

  const connectToWallet = () => {
    if (ethereum === false) {
      console.error('Please make sure you have MetaMask installed.')
    } else {
      ethereum?.request!({ method: 'eth_requestAccounts' })
    }
  }
  return { connectToWallet }
}

export default useConnectWallet

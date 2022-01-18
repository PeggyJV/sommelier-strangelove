import useEthereum from 'hooks/useEthereum'

const useConnectWallet = () => {
  const ethereum = useEthereum()
  const connectToWallet = () =>
    ethereum?.request!({ method: 'eth_requestAccounts' })

  return { connectToWallet }
}

export default useConnectWallet

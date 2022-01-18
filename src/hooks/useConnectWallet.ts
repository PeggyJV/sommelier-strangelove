import useEthereum from 'hooks/useEthereum'

const useConnectWallet = () => {
  const ethereum = useEthereum()
  const getAccounts = () => {
    const accounts = ethereum?.request!({ method: 'eth_requestAccounts' })

    return accounts
  }

  return { getAccounts }
}

export default useConnectWallet

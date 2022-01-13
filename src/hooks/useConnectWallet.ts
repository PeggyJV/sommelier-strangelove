import useEthereum from 'hooks/useEthereum'

const useConnectWallet = async () => {
  const provider = useEthereum()

  if (provider) {
    const res = await provider.request!({ method: 'eth_requestAccounts' })
    const account = (res as any)[0] // this is a quick and dirty solve. Need better solution long term.

    return account
  } else {
    console.error('Please install MetaMask and log in.')
  }
}

export default useConnectWallet

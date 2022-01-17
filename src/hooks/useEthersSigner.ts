import useEthersProvider from './useEthersProvider'

const useEthersSigner = () => {
  const provider = useEthersProvider()
  const signer = provider?.getSigner()

  return signer
}

export default useEthersSigner

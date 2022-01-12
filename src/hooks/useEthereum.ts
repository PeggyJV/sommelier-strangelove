import { useQuery } from 'react-query'

const useEthereum = () =>
  useQuery('ethereum', () => {
    const ethereum = window.ethereum

    return ethereum
  })

export default useEthereum

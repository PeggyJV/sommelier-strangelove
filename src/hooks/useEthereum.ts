import { useEffect, useState } from 'react'

const useEthereum = () => {
  const [eth, setEth] = useState<any>(null)

  useEffect(() => {
    const ethereum = window.ethereum

    setEth(ethereum)
  }, [])

  return eth
}

export default useEthereum

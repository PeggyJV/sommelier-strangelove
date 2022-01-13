import { useEffect, useState } from 'react'

const useEthereum = () => {
  const [eth, setEth] = useState()
  useEffect(() => {
    const ethereum = window.ethereum

    setEth(ethereum)
  }, [])

  return eth
}

export default useEthereum

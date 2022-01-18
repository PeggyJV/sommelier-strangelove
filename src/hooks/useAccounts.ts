import useEthersSigner from 'hooks/useEthersSigner'
import { useEffect, useState } from 'react'

const useAddress = () => {
  const [address, setAddress] = useState<string>()
  const signer = useEthersSigner()

  const getAddress = async () => {
    try {
      const address = await signer?.getAddress()
      setAddress(address)
    } catch (err) {
      console.error("Please verify you're logged in on MetaMask")
    }
  }

  useEffect(() => {
    getAddress()
  }, [signer])

  return address
}

export default useAddress

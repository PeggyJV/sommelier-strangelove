import useEthersSigner from 'hooks/useEthersSigner'
import { useEffect, useState } from 'react'

const useAddress = () => {
  const [address, setAddress] = useState<string>()
  const signer = useEthersSigner()

  const getAddress = async () => {
    const address = await signer?.getAddress()
    setAddress(address)
  }

  useEffect(() => {
    getAddress()
  }, [signer])

  return address
}

export default useAddress

# Ethers

- https://github.com/ethers-io/ethers.js
- https://docs.ethers.io/v5/getting-started/

## Useful Links

- https://blog.logrocket.com/building-dapp-ethers-js/
- https://dev.to/dabit3/the-complete-guide-to-full-stack-ethereum-development-3j13
- https://docs.metamask.io/guide/getting-started.html#basic-considerations

## Notes

### Common Terminology

| Term     | Description                                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Provider | A Provider (in ethers) is a class which provides an abstraction for a connection to the Ethereum Network. It provides read-only access to the Blockchain and its status.                                                  |
| Signer   | A Signer is a class which (usually) in some way directly or indirectly has access to a private key, which can sign messages and transactions to authorize the network to charge your account ether to perform operations. |
| Contract | A Contract is an abstraction which represents a connection to a specific contract on the Ethereum Network, so that applications can use it like a normal JavaScript object.                                               |

### Smart contracts

Smart contracts are programs that run on the Ethereum blockchain. You could think of smart contracts as a normal Ethereum account with some ether stored on it and can perform transactions over the Ethereum network. But unlike a normal account, smart contracts are not controlled by a user. They are rather programmed, deployed to the network, and perform tasks automatically.

### Application Binary Interface

An Application Binary Interface (ABI) is a collection of Fragments which specify how to interact with various components of a Contract.

An Interface helps organize Fragments by type as well as provides the functionality required to encode, decode and work with each component.

Most developers will not require this low-level access to encoding and decoding the binary data on the network and will most likely use a Contract which provides a more convenient interface.

### Signing Data

Custom hook to get signer from MetaMask:

```tsx
// useEthersSigner.ts
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

const useEthersSigner = () => {
  const [signer, setSigner] = useState<any>(null)

  useEffect(() => {
    const ethereum = window.ethereum
    const provider = new ethers.providers.Web3Provider(ethereum)
    const ethSigner = provider.getSigner()

    setSigner(ethSigner)
  }, [])

  return signer
}

export default useEthersSigner
```

Example simple signature:

```tsx
import useEthersSigner from 'hooks/useEthersSigner'

const simpleSignature = async () => {
  const signer = useEthersSigner()
  let message = 'Wow! We signed something in Web3 land :)'
  let signature = await signer.sign(message)
}
```

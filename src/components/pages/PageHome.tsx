import { NextPage } from 'next'
import { Button, Container, Heading } from '@chakra-ui/react'
import Layout from 'components/Layout'
import useConnectWallet from 'hooks/useConnectWallet'
import { useMetaMask } from 'context/metaMaskContext'
import { providers, utils } from 'ethers'

const tx: utils.Deferrable<providers.TransactionRequest> = {
  chainId: 0,
  data: '',
  gasLimit: utils.parseUnits('10000000'),
  nonce: 892374982734982734,
  value: utils.parseUnits('10000000')
}

const PageHome: NextPage = () => {
  const { connectToWallet } = useConnectWallet()
  const { ethereum, address, provider, signer } = useMetaMask()

  const handleTx = async () => {
    const txCount = await provider?.getTransactionCount(address as string)

    console.log({ txCount })

    // signer?.signTransaction(tx)
  }

  console.log({ ethereum, address, provider, signer })

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>
        <Button colorScheme='orange' onClick={connectToWallet}>
          Connect with MetaMask
        </Button>
        <Button colorScheme='green' onClick={handleTx}>
          Make a transaction
        </Button>
      </Container>
    </Layout>
  )
}

export default PageHome

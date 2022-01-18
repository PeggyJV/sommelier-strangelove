import { NextPage } from 'next'
import { Button, Container, Heading } from '@chakra-ui/react'
import Layout from 'components/Layout'
import useConnectWallet from 'hooks/useConnectWallet'
import { useMetaMask } from 'context/metaMaskContext'
import { Transaction, utils } from 'ethers'

const tx: Transaction = {
  chainId: 0,
  data: '',
  gasLimit: utils.parseUnits('10000000'),
  nonce: 892374982734982734,
  value: utils.parseUnits('10000000')
}

const PageHome: NextPage = () => {
  const { connectToWallet } = useConnectWallet()
  const { address, provider, signer } = useMetaMask()

  // const handleTx = async () => {
  //   const txCount = await provider?.getTransactionCount(address as string)
  //   const balance = await provider?.getBalance(address as string)
  //   console.log({ txCount, balance })
  // }
  // handleTx()

  console.log({ address, provider, signer })

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>
        <Button onClick={connectToWallet}>Connect with MetaMask</Button>
        <Button>Make a transaction</Button>
      </Container>
    </Layout>
  )
}

export default PageHome

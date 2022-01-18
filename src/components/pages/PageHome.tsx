import { NextPage } from 'next'
import { Button, Container, Heading } from '@chakra-ui/react'
import Layout from 'components/Layout'
import useConnectWallet from 'hooks/useConnectWallet'

const PageHome: NextPage = () => {
  const { connectToWallet } = useConnectWallet()

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>
        <Button onClick={connectToWallet}>Connect with MetaMask</Button>
      </Container>
    </Layout>
  )
}

export default PageHome

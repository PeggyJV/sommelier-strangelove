import { NextPage } from 'next'
import { Button, Container, Heading } from '@chakra-ui/react'
import Layout from 'components/Layout'
import useEthersProvider from 'hooks/useEthersProvider'

const PageHome: NextPage = () => {
  const provider = useEthersProvider()

  console.log({ provider })

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>
        <Button>MetaMask is: {false}</Button>
      </Container>
    </Layout>
  )
}

export default PageHome

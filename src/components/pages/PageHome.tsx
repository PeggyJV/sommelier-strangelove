import { NextPage } from 'next'
import { Container, Heading } from '@chakra-ui/react'
import Layout from 'components/Layout'
import useEthereum from 'hooks/useEthereum'

const PageHome: NextPage = () => {
  const ethereum = useEthereum()

  console.log({ ethereum })

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>
      </Container>
    </Layout>
  )
}

export default PageHome

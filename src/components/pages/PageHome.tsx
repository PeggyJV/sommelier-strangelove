import { Container, Heading } from '@chakra-ui/react'
import Layout from 'components/Layout'
import { NextPage } from 'next'

const PageHome: NextPage = () => {
  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>
      </Container>
    </Layout>
  )
}

export default PageHome

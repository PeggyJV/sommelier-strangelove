import { NextPage } from 'next'
import { Button, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react'
import Layout from 'components/Layout'
import { Hero } from 'components/Hero'
import { CellarOverviewCard } from 'components/CellarOverviewCard'

const PageHome: NextPage = () => {
  return (
    <Layout>
      <Container maxW='container.lg'>
        <Hero />
        <Flex as='section' direction='column'>
          <Heading>Cellar</Heading>
          <Text>Lorem Ipsum dolor iram servus</Text>
          <Grid gap={6} templateColumns='1fr 1fr'>
            <CellarOverviewCard />
            <Flex align='center' justify='center' bg='black' borderRadius={10}>
              <Flex direction='column' align='center'>
                <Text fontSize='2xl' fontWeight='medium'>
                  Lorem more on the way
                </Text>
                <Text fontSize='lg' color='whiteAlpha.800' pb={6}>
                  Lorem ipsum dolor iram servus
                </Text>
                <Button w='100%' bg='white' color='black'>
                  Connect Wallet
                </Button>
              </Flex>
            </Flex>
          </Grid>
        </Flex>
      </Container>
    </Layout>
  )
}

export default PageHome

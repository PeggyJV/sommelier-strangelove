import { NextPage } from 'next'
import { Box, Container, Flex, Grid, Heading, Text } from '@chakra-ui/react'
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
            <Box bg='black' />
          </Grid>
        </Flex>
      </Container>
    </Layout>
  )
}

export default PageHome

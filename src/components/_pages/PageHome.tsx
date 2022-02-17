import { NextPage } from 'next'
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { Hero } from 'components/Hero'
import { CellarOverviewCard } from 'components/CellarOverviewCard'
import Link from 'components/Link'

const PageHome: NextPage = () => {
  return (
    <Layout>
      <Container maxW='container.lg'>
        <VStack spacing={6} align='flex-start'>
          <Hero />
          <Flex w='100%' as='section' direction='column'>
            <Box pb={4}>
              <Heading>Cellar</Heading>
              <Text>Lorem Ipsum dolor iram servus</Text>
            </Box>
            <Grid gap={6} templateColumns='1fr 1fr'>
              <CellarOverviewCard />
              <Flex
                align='center'
                justify='center'
                bg='black'
                borderRadius={10}
              >
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
          <Grid
            w='100%'
            as='section'
            p={4}
            gap={6}
            templateColumns='1fr 1fr'
            bg='gray.800'
          >
            <Flex align='center' justify='center' bg='gray.900'>
              <Text color='whiteAlpha.700'>Illustration</Text>
            </Flex>
            <VStack spacing={2} align='flex-start' maxW='50ch'>
              <Text>Sommelier Selects</Text>
              <Heading>
                About <br /> AAVE Strategy
              </Heading>
              <Text>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptate.
              </Text>
              <Link>Expand</Link>
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </Layout>
  )
}

export default PageHome

import { NextPage } from 'next'
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
  VStack
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { CellarOverviewCard } from 'components/CellarOverviewCard'

const PageHome: NextPage = () => {
  return (
    <Layout>
      <VStack spacing={6} align='flex-start'>
        <Grid templateColumns='1fr 1fr' gap={6} alignItems='center'>
          <VStack align='flex-start' spacing={4} maxW='70ch'>
            <Heading>Sommelier DeFi</Heading>
            <Text>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo nemo
            </Text>
            <Button px={14} bg='white' color='black'>
              Explore More
            </Button>
          </VStack>
          <Box h={330} bg='gray.800' />
        </Grid>
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
              bg='gray.800'
              borderRadius={10}
            >
              <Flex direction='column' align='center'>
                <Text fontSize='2xl' fontWeight='medium'>
                  More Cellars on the Way
                </Text>
                <Text color='whiteAlpha.800' pb={6}>
                  Additional Cellar information
                </Text>
              </Flex>
            </Flex>
          </Grid>
        </Flex>
        <Grid
          w='100%'
          as='section'
          p={6}
          gap={6}
          templateColumns='0.65fr 1fr'
          bg='gray.800'
          borderRadius={10}
        >
          <Flex h={272} align='center' justify='center' bg='gray.900'>
            <Text color='whiteAlpha.700'>Illustration</Text>
          </Flex>
          <VStack spacing={2} align='flex-start' justify='center' maxW='50ch'>
            <Heading>About AAVE Strategy</Heading>
            <Text>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo. Nemo enim ipsam voluptate.
            </Text>
          </VStack>
        </Grid>
      </VStack>
    </Layout>
  )
}

export default PageHome

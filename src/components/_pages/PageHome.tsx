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
import { CellarOverviewCard } from 'components/_cards/CellarOverviewCard'
import { useConnect } from 'wagmi'
import { Card } from 'components/_cards/Card'

const PageHome: NextPage = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

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
            <Heading>Cellars</Heading>
            <Text color='whiteAlpha.800'>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint.
            </Text>
          </Box>
          <Grid gap={6} templateColumns='1fr 1fr'>
            <CellarOverviewCard isConnected={isConnected} />
            <Card
              display='flex'
              flexDir='column'
              justifyContent='center'
              alignItems='center'
              textAlign='center'
              bgColor='violentViolet.900'
            >
              <Flex direction='column' align='center'>
                <Text fontSize='2xl' fontWeight='medium'>
                  More Coming Soon
                </Text>
                <Text color='whiteAlpha.800' pb={6}>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint.
                </Text>
              </Flex>
            </Card>
          </Grid>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default PageHome

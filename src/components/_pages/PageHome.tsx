import { NextPage } from 'next'
import { Box, Flex, Grid, Heading, Img, Text, VStack } from '@chakra-ui/react'
import Layout from 'components/Layout'
import { CellarOverviewCard } from 'components/_cards/CellarOverviewCard'
import { useConnect } from 'wagmi'
import { Card } from 'components/_cards/Card'
import { BaseButton } from 'components/_buttons/BaseButton'
import { FaArrowRight } from 'react-icons/fa'

const PageHome: NextPage = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Layout>
      <VStack spacing={6} align='flex-start'>
        <Grid
          as='section'
          pb={10}
          templateColumns='1fr 1fr'
          gap={6}
          justifyItems='center'
        >
          <VStack align='flex-start' spacing={4} maxW='70ch'>
            <Heading>Sommelier DeFi</Heading>
            <Text>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga.
            </Text>
            <BaseButton icon={FaArrowRight}>Learn More</BaseButton>
          </VStack>
          <Img src='/placeholders/img-placeholder.png' />
        </Grid>
        <Flex w='100%' as='section' direction='column'>
          <Box pb={4}>
            <Heading>Cellars</Heading>
            <Text maxW='70ch'>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint.
            </Text>
          </Box>
          <Grid gap={6} templateColumns='1fr 1fr'>
            <CellarOverviewCard isConnected={isConnected} />
            <Card bgColor='darker' textAlign='center'>
              <VStack spacing={4}>
                <Img
                  src='/placeholders/img-placeholder.png'
                  boxSize={40}
                  objectFit='contain'
                  pb={4}
                />
                <Text fontSize='2xl' fontWeight='medium'>
                  More Coming Soon
                </Text>
                <Text pb={6}>
                  At vero eos et accusamus et iusto odio dignissimos ducimus qui
                  blanditiis praesentium voluptatum deleniti atque corrupti quos
                  dolores et quas molestias excepturi sint.
                </Text>
              </VStack>
            </Card>
          </Grid>
        </Flex>
      </VStack>
    </Layout>
  )
}

export default PageHome

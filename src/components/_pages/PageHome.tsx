import { NextPage } from 'next'
import {
  Avatar,
  Container,
  Heading,
  HStack,
  Skeleton,
  Stack,
  Text
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { useAccount } from 'wagmi'

const PageHome: NextPage = () => {
  const [account] = useAccount({ fetchEns: true })

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>

        {account.data && (
          <Skeleton isLoaded={!account.loading} rounded='md'>
            <HStack p={4} rounded='md' borderWidth={1} spacing={4}>
              <Avatar
                name={account.data.ens?.name}
                src={account.data.ens?.avatar ?? undefined}
              />
              <Stack flexGrow={1} spacing={1}>
                <Text fontWeight='bold' isTruncated>
                  {account.data.address}
                </Text>
                <Text color='gray.500'>
                  Connected to {account.data.connector?.name}
                </Text>
              </Stack>
            </HStack>
          </Skeleton>
        )}
      </Container>
    </Layout>
  )
}

export default PageHome

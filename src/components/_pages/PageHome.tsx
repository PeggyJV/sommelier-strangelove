import { NextPage } from 'next'
import {
  Avatar,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { useAccount, useConnect } from 'wagmi'
import ConnectButton from 'components/ConnectButton'

const PageHome: NextPage = () => {
  const [account, disconnect] = useAccount({
    fetchEns: true
  })
  const [auth] = useConnect()

  return (
    <Layout>
      <Container maxW='container.lg'>
        <Heading>Welcome Home</Heading>

        {auth.data.connected && account.data && (
          <HStack p={4} rounded='md' borderWidth={1} spacing={4}>
            <Avatar />
            <Stack flexGrow={1} spacing={1}>
              <Text fontWeight='bold' isTruncated>
                {account.data.address}
              </Text>
              <Text color='gray.500'>
                Connected to {account.data.connector?.name}
              </Text>
            </Stack>
            <Button
              colorScheme='red'
              onClick={disconnect}
              isLoading={account.loading}
            >
              Disconnect
            </Button>
          </HStack>
        )}

        {!auth.data.connected &&
          auth.data.connectors.map(c => (
            <ConnectButton connector={c} key={c.id} />
          ))}
      </Container>
    </Layout>
  )
}

export default PageHome

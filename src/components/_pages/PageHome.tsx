import { NextPage } from 'next'
import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Stack,
  Text
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { useAccount, useConnect } from 'wagmi'
import ClientOnly from 'components/ClientOnly'
import { getConnectorScheme } from 'src/utils/chakra'

const PageHome: NextPage = () => {
  const [account, disconnect] = useAccount({
    fetchEns: true
  })
  const [auth, connect] = useConnect()

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

        {!auth.data.connected && (
          <ClientOnly>
            {auth.data.connectors.map(c => (
              <Button
                colorScheme={getConnectorScheme(c.name)}
                isDisabled={!c.ready}
                isLoading={auth.loading}
                key={c.id}
                onClick={() => connect(c)}
              >
                Connect with {c.name}
                {!c.ready && ' (unsupported)'}
              </Button>
            ))}
          </ClientOnly>
        )}
      </Container>
    </Layout>
  )
}

export default PageHome

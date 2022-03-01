import { VFC } from 'react'
import { Box, Container, Heading, HStack, Text } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectButton from 'components/_buttons/ConnectButton'
import { ChainSelector } from 'components/ChainSelector'

const placeholderChains = ['Ethereum', 'Cosmos']

export const TopNav: VFC = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Box
      py={8}
      fontSize='xl'
      borderBottom='2px solid'
      borderColor='violentViolet'
    >
      <Container
        maxW='container.xl'
        display='flex'
        justifyContent='space-between'
      >
        <Text fontFamily='brand' color='light'>
          Overview
        </Text>
        <HStack spacing={4}>
          {isConnected && <ChainSelector chains={placeholderChains} />}
          {auth.data.connectors.map(c => (
            <ConnectButton connector={c} key={c.id} />
          ))}
        </HStack>
      </Container>
    </Box>
  )
}

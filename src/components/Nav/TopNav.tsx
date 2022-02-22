import { VFC } from 'react'
import { Box, Heading, HStack } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectButton from 'components/ConnectButton'
import { ChainSelector } from 'components/ChainSelector'

const placeholderChains = ['Ethereum', 'Cosmos']

export const TopNav: VFC = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Box py={8} display='flex' justifyContent='space-between' fontSize='xl'>
      <Heading>Welcome</Heading>
      <HStack spacing={4}>
        {isConnected && <ChainSelector chains={placeholderChains} />}
        {auth.data.connectors.map(c => (
          <ConnectButton connector={c} key={c.id} />
        ))}
      </HStack>
    </Box>
  )
}

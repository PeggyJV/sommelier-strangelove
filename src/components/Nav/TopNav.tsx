import { VFC } from 'react'
import { Flex, HStack, Text } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectButton from 'components/_buttons/ConnectButton'
import { ChainSelector } from 'components/ChainSelector'

const placeholderChains = ['Ethereum', 'Cosmos']

export const TopNav: VFC = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Flex py={8} px={6} fontSize='xl' justify='space-between'>
      <Text fontFamily='brand' color='light'>
        Overview
      </Text>
      <HStack spacing={4}>
        {isConnected && <ChainSelector chains={placeholderChains} />}
        {auth.data.connectors.map(c => (
          <ConnectButton connector={c} key={c.id} />
        ))}
      </HStack>
    </Flex>
  )
}

import { VFC } from 'react'
import { Flex, Text } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectButton from 'components/_buttons/ConnectButton'

export const TopNav: VFC = () => {
  const [auth] = useConnect()

  return (
    <Flex flex={1} py={8} px={6} fontSize='xl' justify='space-between'>
      <Text fontFamily='brand' color='light'>
        Overview
      </Text>
      {auth.data.connectors.map(c => (
        <ConnectButton connector={c} key={c.id} />
      ))}
    </Flex>
  )
}

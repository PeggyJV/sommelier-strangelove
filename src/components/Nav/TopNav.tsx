import React, { ReactElement } from 'react'
import { Container, Heading, HStack } from '@chakra-ui/react'
import { useConnect } from 'wagmi'
import ConnectButton from 'components/ConnectButton'
import { ChainSelector } from 'components/ChainSelector'

const placeholderChains = ['Ethereum', 'Atom', 'Somm']

export const TopNav = (): ReactElement => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Container
      py={8}
      maxW='container.lg'
      display='flex'
      justifyContent='space-between'
      fontSize='xl'
    >
      <Heading>Welcome</Heading>
      <HStack spacing={4}>
        {isConnected && <ChainSelector chains={placeholderChains} />}
        {auth.data.connectors.map(c => (
          <ConnectButton connector={c} key={c.id} />
        ))}
      </HStack>
    </Container>
  )
}

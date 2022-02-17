import React, { ReactElement } from 'react'
import { Button, Container, Heading, HStack, Text } from '@chakra-ui/react'
import { useAccount, useConnect } from 'wagmi'
import ConnectButton from 'components/ConnectButton'
import { ChainSelector } from 'components/ChainSelector'
// import NavLinks from './Navlinks'

const placeholderChains = ['Ethereum', 'Atom', 'Somm']

const Navbar = (): ReactElement => {
  const [account, disconnect] = useAccount({
    fetchEns: true
  })
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Container
      as='nav'
      py={8}
      maxW='container.lg'
      display='flex'
      justifyContent='space-between'
      fontSize='xl'
    >
      <Heading>Welcome</Heading>
      <HStack spacing={4}>
        {/* <NavLinks /> */}
        {isConnected
          ? account.data && (
              <HStack spacing={6}>
                <ChainSelector chains={placeholderChains} />
                <Text maxW='12ch' isTruncated>
                  {account?.data?.address}
                </Text>
                <Button
                  minW='max-content'
                  colorScheme='red'
                  onClick={disconnect}
                  isLoading={account.loading}
                >
                  Disconnect
                </Button>
              </HStack>
            )
          : auth.data.connectors.map(c => (
              <ConnectButton connector={c} key={c.id} />
            ))}
      </HStack>
    </Container>
  )
}

export default Navbar

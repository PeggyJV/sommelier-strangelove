import React, { ReactElement } from 'react'

import NavLinks from './Navlinks'

import { Box, Container } from '@chakra-ui/react'
import { AiOutlineSmile } from 'react-icons/ai'
import { useAccount, useConnect } from 'wagmi'
import ConnectButton from 'components/ConnectButton'

const Navbar = (): ReactElement => {
  const [account, disconnect] = useAccount({
    fetchEns: true
  })
  const [auth] = useConnect()

  return (
    <Container
      as='nav'
      display='flex'
      px={4}
      py={2}
      maxW='container.lg'
      justifyContent='space-between'
      fontSize='xl'
      textTransform='uppercase'
    >
      <Box as={AiOutlineSmile} boxSize={8} />
      <NavLinks />
      {!auth.data.connected &&
        auth.data.connectors.map(c => (
          <ConnectButton connector={c} key={c.id} />
        ))}
    </Container>
  )
}

export default Navbar

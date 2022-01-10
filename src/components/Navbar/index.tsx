import React, { ReactElement } from 'react'

import NavLinks from './Navlinks'

import { Box, Container, Flex } from '@chakra-ui/react'
import { AiOutlineSmile } from 'react-icons/ai'

const Navbar = (): ReactElement => {
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
    </Container>
  )
}

export default Navbar

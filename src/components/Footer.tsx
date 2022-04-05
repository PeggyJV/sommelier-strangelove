import { Container, ContainerProps, HStack, Text } from '@chakra-ui/react'
import React, { VFC } from 'react'
import Link from './Link'
import Socials from './Socials'

const Footer: VFC<ContainerProps> = props => {
  return (
    <Container
      display='flex'
      justifyContent='space-between'
      alignItems='center'
      py={8}
      borderTop='1px solid'
      borderColor='rgba(203, 198, 209, 0.25)'
      maxW='container.lg'
      {...props}
    >
      <Text>&copy; {new Date().getFullYear()} Sommelier</Text>
      <HStack spacing={4} justify='center' align='center'>
        <Link href='/'>Documentation</Link>
        <Link href='/terms'>Terms</Link>
        <Link href='/privacy'>Privacy</Link>
        <Socials />
      </HStack>
    </Container>
  )
}

export default Footer

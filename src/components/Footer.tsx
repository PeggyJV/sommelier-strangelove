import { Flex, FlexProps, HStack } from '@chakra-ui/react'
import React, { VFC } from 'react'
import Link from './Link'
import Socials from './Socials'

const Footer: VFC<FlexProps> = props => {
  return (
    <Flex py={4} justify='space-between' borderTop='1px solid' {...props}>
      <Socials />
      <HStack spacing={4} py={8} justify='center'>
        <Link href='/'>Documentation</Link>
        <Link href='/terms'>Terms</Link>
        <Link href='/privacy'>Privacy</Link>
      </HStack>
    </Flex>
  )
}

export default Footer

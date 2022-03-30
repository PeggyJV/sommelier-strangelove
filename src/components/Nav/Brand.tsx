import { HStack, Img, Text } from '@chakra-ui/react'
import Link from 'components/Link'
import { LogoTextIcon } from 'components/_icons'
import React from 'react'

const Brand = () => {
  return (
    <Link px={5} href='/'>
      <HStack>
        <LogoTextIcon
          w='9rem'
          h='2rem'
          color='sunsetOrange'
          _hover={{ color: 'white' }}
        />
      </HStack>
    </Link>
  )
}

export default Brand

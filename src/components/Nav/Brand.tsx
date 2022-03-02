import { HStack, Img, Text } from '@chakra-ui/react'
import Link from 'components/Link'
import React from 'react'

const Brand = () => {
  return (
    <Link href='/'>
      <HStack>
        <Img src='/placeholders/logomark.png' boxSize={10} />
        <Text
          fontSize='lg'
          fontWeight='bold'
          fontFamily='brand'
          textTransform='uppercase'
        >
          Sommelier
        </Text>
      </HStack>
    </Link>
  )
}

export default Brand

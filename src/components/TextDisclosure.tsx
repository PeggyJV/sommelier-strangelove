import { Box, BoxProps, Flex, useDisclosure, VStack } from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import React, { VFC } from 'react'
import { BiMinus } from 'react-icons/bi'
import { BsPlus } from 'react-icons/bs'

export const TextDisclosure: VFC<BoxProps> = ({ children, ...rest }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <Flex direction='column' h='100%'>
      <Box flex={1} position='relative' overflow='hidden' {...rest}>
        <Box position={isOpen ? 'relative' : 'absolute'}>{children}</Box>
      </Box>
      <BaseButton
        mt={4}
        maxW='max-content'
        icon={isOpen ? BiMinus : BsPlus}
        onClick={isOpen ? onClose : onOpen}
      >
        {isOpen ? 'Read Less' : 'Read More'}
      </BaseButton>
    </Flex>
  )
}

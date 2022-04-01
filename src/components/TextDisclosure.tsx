import { Box, BoxProps, Flex, useDisclosure } from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import React, { VFC } from 'react'
import { BiMinus } from 'react-icons/bi'
import { BsPlus } from 'react-icons/bs'

export const TextDisclosure: VFC<BoxProps> = ({ children, ...rest }) => {
  const { isOpen, onClose, onOpen } = useDisclosure()

  return (
    <Flex direction='column' h='100%'>
      <Box flex={1} position='relative' overflow='hidden' {...rest}>
        <Box position={isOpen ? 'relative' : 'absolute'}>
          <Box
            w='100%'
            h='200px'
            pos='absolute'
            display={isOpen ? 'none' : 'block'}
            bottom='190px'
            bg='backgrounds.overlayGradient'
            zIndex={2}
          />
          {children}
        </Box>
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

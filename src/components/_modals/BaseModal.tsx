import {
  Divider,
  Heading,
  HStack,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  ModalProps
} from '@chakra-ui/react'
import React, { VFC } from 'react'

interface BaseModalProps extends ModalProps {
  heading?: string
}

const BaseModal: VFC<BaseModalProps> = ({ children, heading, ...rest }) => {
  return (
    <Modal {...rest}>
      <ModalOverlay />
      <ModalContent
        px={5}
        py={8}
        bg='black'
        color='text.body.light'
        border='1px solid'
        borderColor='warmPink'
        borderRadius={24}
      >
        <HStack justify='space-between'>
          {heading && <Heading fontSize='4xl'>{heading}</Heading>}
          <ModalCloseButton position='static' size='lg' />
        </HStack>
        <Divider my={2} borderColor='text.body.lightMuted' />
        {children}
      </ModalContent>
    </Modal>
  )
}

export default BaseModal

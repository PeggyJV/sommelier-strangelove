import { ModalProps, Text, VStack } from '@chakra-ui/react'
import { ClaimForm } from 'components/_forms/ClaimForm'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { BaseModal } from './BaseModal'

type ClaimModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

export const ClaimModal: VFC<ClaimModalProps> = props => {
  return (
    <BaseModal heading='Claim' {...props}>
      <VStack pb={10} spacing={6} align='stretch'>
        <VStack align='flex-start'>
          <CardHeading>available</CardHeading>
          <Text as='span'>100 SOMM</Text>
        </VStack>
      </VStack>
      <ClaimForm />
    </BaseModal>
  )
}

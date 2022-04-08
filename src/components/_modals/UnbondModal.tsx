import { ModalProps, Text, VStack } from '@chakra-ui/react'
import { UnbondForm } from 'components/_forms/UnbondForm'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { BaseModal } from './BaseModal'

type UnbondModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

export const UnbondModal: VFC<UnbondModalProps> = props => {
  return (
    <BaseModal heading='Unbond' {...props}>
      <VStack pb={10} spacing={6} align='stretch'>
        <VStack align='flex-start'>
          <CardHeading>available</CardHeading>
          <Text as='span'>5,000 BONDED LP TOKENS</Text>
        </VStack>
      </VStack>
      <UnbondForm />
    </BaseModal>
  )
}

import { ModalProps, Text, VStack } from '@chakra-ui/react'
import { WithdrawForm } from 'components/_forms/WithdrawForm'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { BaseModal } from './BaseModal'

type WithdrawModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

export const WithdrawModal: VFC<WithdrawModalProps> = props => {
  return (
    <BaseModal heading='Withdraw' {...props}>
      <VStack pb={10} spacing={6} align='stretch'>
        <VStack align='flex-start'>
          <CardHeading>available</CardHeading>
          <Text as='span'>5,000 LP TOKENS</Text>
        </VStack>
      </VStack>
      <WithdrawForm />
    </BaseModal>
  )
}

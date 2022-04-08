import { ModalProps, Text, VStack } from '@chakra-ui/react'
import { BondForm } from 'components/_forms/BondForm'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import BaseModal from './BaseModal'

type BondModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

const BondModal: VFC<BondModalProps> = props => {
  return (
    <BaseModal heading='Bond' {...props}>
      <VStack pb={10} spacing={6} align='stretch'>
        <VStack align='flex-start'>
          <CardHeading>available</CardHeading>
          <Text as='span'>10,000 LP TOKENS</Text>
        </VStack>
      </VStack>
      <BondForm />
    </BaseModal>
  )
}

export default BondModal

import { HStack, ModalProps, Text, VStack } from '@chakra-ui/react'
import { DepositForm } from 'components/_forms/DepositForm'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { BaseModal } from './BaseModal'

type DepositModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

export const DepositModal: VFC<DepositModalProps> = props => {
  return (
    <BaseModal heading='Deposit' {...props}>
      <VStack pb={10} spacing={6} align='stretch'>
        <HStack spacing={6}>
          <VStack align='flex-start'>
            <CardHeading>cellar</CardHeading>
            <Text as='span'>CAave</Text>
          </VStack>
          <VStack align='flex-start'>
            <CardHeading>maximum deposit</CardHeading>
            <Text as='span'>$10 USDC</Text>
          </VStack>
          <VStack align='flex-start'>
            <CardHeading>deposit clears in</CardHeading>
            <Text as='span'>6d 4h 23m</Text>
          </VStack>
        </HStack>
        <VStack align='flex-start'>
          <CardHeading>available</CardHeading>
          <Text as='span'>10,000 USDC</Text>
        </VStack>
      </VStack>
      <DepositForm />
    </BaseModal>
  )
}

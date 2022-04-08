import { useDisclosure } from '@chakra-ui/react'
import { DepositModal } from 'components/_modals/DepositModal'
import { VFC } from 'react'
import { BaseButton } from './BaseButton'

export const DepositButton: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <BaseButton variant='solid' onClick={onOpen}>
        Deposit
      </BaseButton>
      <DepositModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

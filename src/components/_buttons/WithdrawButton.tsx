import { useDisclosure } from '@chakra-ui/react'
import { WithdrawModal } from 'components/_modals/WithdrawModal'
import { VFC } from 'react'
import { TertiaryButton } from './TertiaryButton'

export const WithdrawButton: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <TertiaryButton onClick={onOpen}>
        Withdraw
      </TertiaryButton>
      <WithdrawModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

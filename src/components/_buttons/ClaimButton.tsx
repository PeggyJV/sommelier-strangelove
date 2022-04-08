import { useDisclosure } from '@chakra-ui/react'
import { ClaimModal } from 'components/_modals/ClaimModal'
import { VFC } from 'react'
import { BaseButton } from './BaseButton'

export const ClaimButton: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <BaseButton onClick={onOpen}>Claim</BaseButton>
      <ClaimModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

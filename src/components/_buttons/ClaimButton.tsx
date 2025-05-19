import { useDisclosure } from '@chakra-ui/react'
import { ClaimModal } from 'components/_modals/ClaimModal'
import { FC } from 'react'
import { BaseButton } from './BaseButton'

export const ClaimButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <BaseButton onClick={onOpen}>Claim</BaseButton>
      <ClaimModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

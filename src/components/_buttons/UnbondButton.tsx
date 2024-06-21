import { useDisclosure } from '@chakra-ui/react'
import { UnbondModal } from 'components/_modals/UnbondModal'
import { TertiaryButton } from './TertiaryButton'

export const UnbondButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <TertiaryButton onClick={onOpen}>Unbond</TertiaryButton>
      <UnbondModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

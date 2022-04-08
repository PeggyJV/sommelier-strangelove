import { useDisclosure } from '@chakra-ui/react'
import { UnbondModal } from 'components/_modals/UnbondModal'
import { VFC } from 'react'
import { TertiaryButton } from './TertiaryButton'

export const UnbdondButton: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <TertiaryButton onClick={onOpen}>Unbdond</TertiaryButton>
      <UnbondModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

import { useDisclosure } from '@chakra-ui/react'
import { BondModal } from 'components/_modals/BondModal'
import { VFC } from 'react'
import { BaseButton } from './BaseButton'

export const BondButton: VFC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <BaseButton onClick={onOpen}>Bond</BaseButton>
      <BondModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

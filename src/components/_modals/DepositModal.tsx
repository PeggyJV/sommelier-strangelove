import { Box, ModalProps } from '@chakra-ui/react'
import { VFC } from 'react'
import BaseModal from './BaseModal'

type DepositModalProps = Pick<ModalProps, 'isOpen' | 'onClose'>

const DepositModal: VFC<DepositModalProps> = props => {
  return (
    <BaseModal heading='Deposit' {...props}>
      <Box>DepositModal</Box>
    </BaseModal>
  )
}

export default DepositModal

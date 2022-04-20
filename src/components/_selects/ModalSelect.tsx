import { Select, SelectProps } from '@chakra-ui/react'
import { VFC } from 'react'

export const ModalSelect: VFC<SelectProps> = ({ children, ...rest }) => {
  return (
    <Select
      size='lg'
      variant='filled'
      bg='transparentPurple'
      borderRadius={16}
      _placeholder={{
        color: 'whiteAlpha.400'
      }}
      _hover={{
        bg: 'transparentPurple'
      }}
      {...rest}
    >
      {children}
    </Select>
  )
}

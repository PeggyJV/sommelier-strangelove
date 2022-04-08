import { forwardRef, Input, InputProps } from '@chakra-ui/react'
import { VFC } from 'react'

export const ModalInput: VFC<InputProps> = forwardRef<InputProps, 'input'>(
  (props, ref) => {
    return (
      <Input
        autoComplete='off'
        ref={ref}
        size='lg'
        py={7}
        fontWeight='bold'
        borderRadius={16}
        borderColor='warmPink'
        placeholder='Enter Amount'
        bg='transparentPurple'
        _invalid={{
          borderColor: 'energyYellow'
        }}
        _hover={{
          borderColor: 'warmPink'
        }}
        {...props}
      />
    )
  }
)

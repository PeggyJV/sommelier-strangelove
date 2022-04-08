import { VFC } from 'react'
import { Button, ButtonProps, forwardRef } from '@chakra-ui/react'

export const SecondaryButton: VFC<ButtonProps> = forwardRef<
  ButtonProps,
  'button'
>((props, ref) => {
  return (
    <Button
      variant='outline'
      color='white'
      border='2px solid'
      borderColor='warmPink'
      _hover={{ bg: 'warmPink' }}
      {...props}
    />
  )
})

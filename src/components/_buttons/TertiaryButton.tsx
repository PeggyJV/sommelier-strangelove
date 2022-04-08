import { Button, ButtonProps, forwardRef } from '@chakra-ui/react'
import { VFC } from 'react'

export const TertiaryButton: VFC<ButtonProps> = forwardRef<
  ButtonProps,
  'button'
>((props, ref) => {
  return <Button ref={ref} variant='unstyled' color='warmPink' {...props} />
})

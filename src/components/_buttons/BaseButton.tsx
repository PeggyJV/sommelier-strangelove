import { Button, ButtonProps, forwardRef, Icon } from '@chakra-ui/react'
import { VFC } from 'react'

interface BaseButtonProps extends Omit<ButtonProps, 'icon'> {
  icon?: any
}

export const BaseButton: VFC<BaseButtonProps> = forwardRef<
  BaseButtonProps,
  'button'
>(({ icon, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      variant='outline'
      color='white'
      borderColor='electricIndigo.400'
      rightIcon={
        icon && (
          <Icon
            as={icon}
            bgColor='electricIndigo.400'
            borderRadius='50%'
            boxSize={6}
            p={1}
          />
        )
      }
      _hover={{
        color: 'electricIndigo.400',
        bgColor: 'white',
        borderColor: 'white',
        span: {
          color: 'white'
        }
      }}
      {...rest}
    />
  )
})

import { Button, ButtonProps, forwardRef, Icon } from '@chakra-ui/react'
import { VFC } from 'react'

interface BaseButtonProps extends Omit<ButtonProps, 'icon'> {
  icon?: any
}

export const BaseButton: VFC<BaseButtonProps> = forwardRef<
  BaseButtonProps,
  'button'
>(({ icon, variant, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      role='group'
      variant={variant || 'outline'}
      color='white'
      border='1.5px solid'
      borderColor='electricIndigo.500'
      rightIcon={
        icon && (
          <Icon
            as={icon}
            color={variant === 'solid' ? 'electricIndigo.500' : 'white'}
            bgColor={variant === 'solid' ? 'white' : 'electricIndigo.500'}
            borderRadius='50%'
            boxSize={6}
            p={1}
            _groupHover={{
              color: 'brilliantRose.500',
              bgColor: 'white'
            }}
          />
        )
      }
      _hover={{
        color: 'white',
        bgColor: 'brilliantRose.500',
        borderColor: 'brilliantRose.500'
      }}
      {...rest}
    />
  )
})

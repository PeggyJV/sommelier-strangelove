import { Button, ButtonProps, Icon } from '@chakra-ui/react'
import { VFC } from 'react'

interface BaseButtonProps extends Omit<ButtonProps, 'icon'> {
  icon?: any
}

export const BaseButton: VFC<BaseButtonProps> = ({ icon, ...rest }) => {
  return (
    <Button
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
}

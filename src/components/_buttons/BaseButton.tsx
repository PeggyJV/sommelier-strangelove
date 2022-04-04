import {
  Button,
  ButtonProps,
  forwardRef,
  Icon,
  IconProps
} from '@chakra-ui/react'
import { VFC } from 'react'

export interface BaseButtonProps extends Omit<ButtonProps, 'icon'> {
  icon?: any
  iconProps?: IconProps
}

export const BaseButton: VFC<BaseButtonProps> = forwardRef<
  BaseButtonProps,
  'button'
>(({ icon, variant, iconProps, ...rest }, ref) => {
  return (
    <Button
      ref={ref}
      role='group'
      py={3}
      px={6}
      color='white'
      bg='backgrounds.buttonGradient'
      border='4px solid'
      borderColor='aubergine'
      borderRadius='100px'
      overflow='hidden'
      rightIcon={
        icon && (
          <Icon
            as={icon}
            color='black'
            bgColor='white'
            borderRadius='50%'
            boxSize={6}
            p={1}
            _groupHover={{
              color: 'burntPink',
              bgColor: 'white'
            }}
            {...iconProps}
          />
        )
      }
      _hover={{
        color: 'white',
        bg: 'backgrounds.buttonHoverGradient',
        borderColor: 'burntPink'
      }}
      _disabled={{
        color: 'text.body.lightMuted',
        bg: 'darkPlum'
      }}
      {...rest}
    />
  )
})

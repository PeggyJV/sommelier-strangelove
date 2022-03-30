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
      color='black'
      bg='energyYellow'
      rightIcon={
        icon && (
          <Icon
            as={icon}
            color='energyYellow'
            bgColor='black'
            borderRadius='50%'
            boxSize={6}
            p={1}
            _groupHover={{
              color: 'sunsetOrange',
              bgColor: 'white'
            }}
            {...iconProps}
          />
        )
      }
      _hover={{
        color: 'white',
        bg: 'sunsetOrange'
      }}
      _disabled={{
        color: 'text.body.lightMuted',
        bg: 'uiChrome.dataBorder'
      }}
      {...rest}
    />
  )
})

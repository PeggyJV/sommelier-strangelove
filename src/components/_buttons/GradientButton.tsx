import { Box, forwardRef } from '@chakra-ui/react'
import { VFC } from 'react'
import { BaseButton, BaseButtonProps } from './BaseButton'

export const GradientButton: VFC<BaseButtonProps> = forwardRef<
  BaseButtonProps,
  'button'
>(({ icon, ...rest }, ref) => {
  return (
    <Box ref={ref} p='1.5px' bg='backgrounds.brandGradient' borderRadius={25} h='fit-content'>
      <BaseButton
        icon={icon}
        color='white'
        bg='backgrounds.offBlack'
        _hover={{
          color: 'white',
          bg: 'backgrounds.brandGradient'
        }}
        _disabled={{
          bg: 'backgrounds.brandGradient'
        }}
        iconProps={{
          color: 'black',
          bgColor: 'white'
        }}
        {...rest}
      />
    </Box>
  )
})

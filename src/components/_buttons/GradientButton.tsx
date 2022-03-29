import { Box, forwardRef } from '@chakra-ui/react'
import { VFC } from 'react'
import { BaseButton, BaseButtonProps } from './BaseButton'

export const GradientButton: VFC<BaseButtonProps> = forwardRef<
  BaseButtonProps,
  'button'
>(({ icon, variant, ...rest }, ref) => {
  return (
    <Box ref={ref} bg='backgrounds.brandGradient' p='1.5px' borderRadius={25}>
      <BaseButton
        icon={icon}
        variant={variant}
        color='white'
        bg='backgrounds.offBlack'
        _hover={{
          color: 'white',
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

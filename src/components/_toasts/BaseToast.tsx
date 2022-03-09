import {
  CloseButton,
  forwardRef,
  HStack,
  Icon,
  StackProps,
  ToastOptions
} from '@chakra-ui/react'
import { useBrandedToast } from 'hooks/chakra'
import { VFC } from 'react'

interface BaseToastProps
  extends StackProps,
    Partial<Pick<ToastOptions, 'status'>> {}

export const BaseToast: VFC<BaseToastProps> = forwardRef<BaseToastProps, 'div'>(
  ({ children, status }, ref) => {
    const { close } = useBrandedToast()

    return (
      <HStack
        ref={ref}
        w='26.25rem'
        p={8}
        spacing={6}
        justify='space-between'
        align='flex-start'
        bg={
          status === 'success'
            ? 'backgrounds.successGradient'
            : status === 'error'
            ? 'backgrounds.dangerGradient'
            : 'backgrounds.primaryGradient'
        }
        borderRadius={6}
      >
        <Icon boxSize={8} />
        {children}
        <CloseButton
          borderRadius='50%'
          border='2px solid'
          borderColor='text.body.lightMuted'
          color='text.body.lightMuted'
          onClick={close}
        />
      </HStack>
    )
  }
)

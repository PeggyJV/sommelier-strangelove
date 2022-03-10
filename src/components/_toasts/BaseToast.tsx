import {
  CloseButton,
  forwardRef,
  HStack,
  Icon,
  Spinner,
  StackProps,
  Status
} from '@chakra-ui/react'
import { VFC } from 'react'

interface BaseToastProps extends StackProps {
  closeHandler: () => void
  status?: Status
  isLoading?: boolean
}

export const BaseToast: VFC<BaseToastProps> = forwardRef<BaseToastProps, 'div'>(
  ({ children, status, closeHandler, isLoading }, ref) => {
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
        {isLoading ? <Spinner boxSize={8} /> : <Icon boxSize={8} />}
        {children}
        <CloseButton
          borderRadius='50%'
          border='2px solid'
          borderColor='text.body.lightMuted'
          color='text.body.lightMuted'
          onClick={closeHandler}
        />
      </HStack>
    )
  }
)

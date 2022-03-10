import {
  CloseButton,
  Flex,
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
  icon?: any
}

export const BaseToast: VFC<BaseToastProps> = forwardRef<BaseToastProps, 'div'>(
  ({ children, status, closeHandler, isLoading, icon }, ref) => {
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
        borderRadius={16}
      >
        {isLoading ? (
          <Flex
            boxSize={8}
            align='center'
            justify='center'
            bg='white'
            color='text.body.dark'
            borderRadius='50%'
          >
            <Spinner size='sm' />
          </Flex>
        ) : (
          <Icon
            boxSize={8}
            p={2}
            bg='white'
            color='text.body.dark'
            borderRadius='50%'
            as={icon}
          />
        )}

        {children}
        <CloseButton
          borderRadius='50%'
          border='2px solid'
          borderColor='text.body.lightMuted'
          color='text.body.lightMuted'
          _hover={{
            bgColor: 'white',
            borderColor: 'white',
            color: 'text.body.dark'
          }}
          onClick={closeHandler}
        />
      </HStack>
    )
  }
)

import {
  Box,
  CloseButton,
  Flex,
  forwardRef,
  Heading,
  HStack,
  Icon,
  Spinner,
  StackProps,
  Status,
  VStack
} from '@chakra-ui/react'
import { useToastStyles } from 'hooks/chakra'
import { VFC } from 'react'

interface BaseToastProps extends StackProps {
  closeHandler: () => void
  status?: Status
  isLoading?: boolean
  heading?: string
}

export const BaseToast: VFC<BaseToastProps> = forwardRef<BaseToastProps, 'div'>(
  ({ children, heading, status, closeHandler, isLoading }, ref) => {
    const {
      dynamicBoxStyles,
      dynamicHeadingStyles,
      dynamicStackStyles,
      dynamicIconStyles,
      dynamicIcon
    } = useToastStyles(status)

    return (
      <Box p={2} borderRadius={12} {...dynamicBoxStyles} zIndex='toast'>
        <HStack
          ref={ref}
          w='26.25rem'
          p={8}
          spacing={6}
          justify='space-between'
          align='flex-start'
          borderRadius={8}
          {...dynamicStackStyles}
        >
          {isLoading ? (
            <Flex
              boxSize={8}
              align='center'
              justify='center'
              borderRadius='50%'
            >
              <Spinner size='sm' />
            </Flex>
          ) : (
            <Icon
              boxSize={5}
              p={0.5}
              border='2px solid'
              borderRadius='50%'
              as={dynamicIcon}
              {...dynamicIconStyles}
            />
          )}
          <VStack align='flex-start'>
            {heading && (
              <Heading size='sm' {...dynamicHeadingStyles}>
                {heading}
              </Heading>
            )}
            {children}
          </VStack>
          <CloseButton size='lg' color='white' onClick={closeHandler} />
        </HStack>
      </Box>
    )
  }
)

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
  VStack,
} from "@chakra-ui/react"
import { useToastStyles } from "hooks/chakra"
import { VFC } from "react"

interface BaseToastProps extends StackProps {
  closeHandler: () => void
  status?: Status | "primary"
  isLoading?: boolean
  heading?: string
}

export const BaseToast: VFC<BaseToastProps> = forwardRef<
  BaseToastProps,
  "div"
>(({ children, heading, status, closeHandler, isLoading }, ref) => {
  const {
    dynamicBoxStyles,
    dynamicHeadingStyles,
    dynamicStackStyles,
    dynamicIconStyles,
    dynamicIcon,
  } = useToastStyles(status)

  return (
    <Box
      ref={ref}
      borderRadius={12}
      w="26.25rem"
      p={8}
      {...dynamicBoxStyles}
      zIndex="toast"
    >
      <HStack justify="space-between" align="flex-start">
        <HStack
          spacing={3}
          align="flex-start"
          {...dynamicStackStyles}
        >
          {isLoading ? (
            <Flex
              boxSize={8}
              align="center"
              justify="center"
              borderRadius="50%"
            >
              <Spinner size="sm" />
            </Flex>
          ) : (
            <Icon
              boxSize={5}
              as={dynamicIcon}
              {...dynamicIconStyles}
            />
          )}
          <VStack align="flex-start">
            {heading && (
              <Heading size="sm" {...dynamicHeadingStyles}>
                {heading}
              </Heading>
            )}
            {children}
          </VStack>
        </HStack>
        <CloseButton size="lg" color="white" onClick={closeHandler} />
      </HStack>
    </Box>
  )
})

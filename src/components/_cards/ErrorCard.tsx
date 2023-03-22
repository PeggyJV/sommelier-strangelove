import { BoxProps, Center, Stack, Text } from "@chakra-ui/react"
import { TransparentCard } from "./TransparentCard"

interface ErrorCardProps extends BoxProps {
  message?: string
}

export const ErrorCard = ({
  message,
  children,
  ...rest
}: ErrorCardProps) => (
  <TransparentCard
    px={{ base: 6, sm: 6, md: 8 }}
    py={{ base: 6, md: 8 }}
    overflow="visible"
    {...rest}
  >
    <Center>
      <Stack>
        <Text color="red.400">
          {message || "Something went wrong, please try again later"}
        </Text>
        {children}
      </Stack>
    </Center>
  </TransparentCard>
)

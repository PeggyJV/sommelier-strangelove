import { Center, Text } from "@chakra-ui/react"
import { TransparentCard } from "./TransparentCard"

export const ErrorCard = () => (
  <TransparentCard
    px={{ base: 6, sm: 6, md: 8 }}
    py={{ base: 6, md: 8 }}
    overflow="visible"
  >
    <Center>
      <Text color="red.base">
        Something went wrong, please try again later
      </Text>
    </Center>
  </TransparentCard>
)

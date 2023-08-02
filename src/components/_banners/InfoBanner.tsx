import { VFC, ReactNode } from "react"
import { HStack, VStack, Text } from "@chakra-ui/react"

interface InfoBannerProps {
  text: ReactNode
}

export const InfoBanner: VFC<InfoBannerProps> = ({ text }) => {
  return (
    <HStack
      p={4}
      mb={12}
      spacing={4}
      align="center"
      justify="center"
      backgroundColor="turquoise.extraDark"
      border="2px solid"
      borderRadius={16}
      borderColor="turquoise.dark"
    >
      <VStack align="center" justify="center">
        <Text textAlign="center">{text}</Text>
      </VStack>
    </HStack>
  )
}

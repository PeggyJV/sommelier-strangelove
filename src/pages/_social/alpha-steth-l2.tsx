import { Box, ChakraProvider, DarkMode } from "@chakra-ui/react"
import theme from "theme/index"
import AlphaStethL2Card from "components/social/AlphaStethL2Card"

export default function AlphaStethL2SocialPage() {
  return (
    <ChakraProvider theme={theme}>
      <DarkMode>
        <Box w="1200px" h="675px" overflow="hidden">
          <AlphaStethL2Card />
        </Box>
      </DarkMode>
    </ChakraProvider>
  )
}

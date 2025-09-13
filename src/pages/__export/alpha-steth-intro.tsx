import { Box, ChakraProvider } from "@chakra-ui/react"
import theme from "src/theme"
import IntroBanner from "components/banners/IntroBanner"

export default function AlphaStethIntroExportPage() {
  return (
    <ChakraProvider theme={theme}>
      <Box w="1920px" h="1080px" overflow="hidden">
        <IntroBanner />
      </Box>
    </ChakraProvider>
  )
}

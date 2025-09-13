import { Box, ChakraProvider } from "@chakra-ui/react"
import theme from "src/theme"
import OutroBanner from "components/banners/OutroBanner"

export default function OutroBannerPage() {
  return (
    <ChakraProvider theme={theme}>
      <Box w="1920px" h="1080px" overflow="hidden">
        <OutroBanner />
      </Box>
    </ChakraProvider>
  )
}

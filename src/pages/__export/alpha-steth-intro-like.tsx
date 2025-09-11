import { Box, ChakraProvider } from "@chakra-ui/react"
import theme from "src/theme"
import AlphaStethIntroLikeRef from "components/_export/AlphaStethIntroLikeRef"

export default function AlphaStethIntroLikeExportPage() {
  return (
    <ChakraProvider theme={theme}>
      <Box w="1920px" h="1080px" overflow="hidden">
        <AlphaStethIntroLikeRef />
      </Box>
    </ChakraProvider>
  )
}

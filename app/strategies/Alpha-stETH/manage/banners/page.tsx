"use client"
import { Box, ChakraProvider } from "@chakra-ui/react"
import theme from "src/theme"
import AlphaStethIntroBanner from "src/sandbox/banners/AlphaStethIntroBanner"

export default function AlphaStethBannersSandboxPage() {
  // No header/footer; render only the banner frame
  const debug = false
  return (
    <ChakraProvider theme={theme}>
      <Box
        w="100vw"
        h="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <AlphaStethIntroBanner
          debugOutline={debug}
          scale={1.3}
          offsetY={100}
        />
      </Box>
    </ChakraProvider>
  )
}

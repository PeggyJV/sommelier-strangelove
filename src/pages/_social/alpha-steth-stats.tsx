import { Box, ChakraProvider, DarkMode } from "@chakra-ui/react"
import theme from "theme/index"
import AlphaStethStatsCard from "components/social/AlphaStethStatsCard"
import { useRouter } from "next/router"

export default function AlphaStethStatsSocialPage() {
  const router = useRouter()
  const tvl = String(router.query.tvl ?? "250M")
  const apy = String(router.query.apy ?? "12.3")
  return (
    <ChakraProvider theme={theme}>
      <DarkMode>
        <Box w="1200px" h="675px" overflow="hidden">
          <AlphaStethStatsCard tvlUsd={tvl} netApyPercent={apy} />
        </Box>
      </DarkMode>
    </ChakraProvider>
  )
}

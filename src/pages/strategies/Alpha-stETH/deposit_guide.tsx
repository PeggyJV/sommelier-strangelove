import Head from "next/head"
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  AspectRatio,
  ChakraProvider,
} from "@chakra-ui/react"
import theme from "src/theme"
import NextLink from "next/link"
import { ArrowLeftIcon } from "components/_icons/ArrowLeftIcon"

export default function AlphaStEthDepositGuidePage() {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Alpha stETH — Deposit Guide</title>
        <meta
          name="description"
          content="Alpha stETH deposit walkthrough — video tutorial"
        />
        <link
          rel="canonical"
          href="https://app.somm.finance/strategies/Alpha-stETH/deposit_guide"
        />
        <meta property="og:type" content="video.other" />
        <meta
          property="og:video"
          content="https://app.somm.finance/assets/tutorial/alpha_st_eth_deposit.mp4"
        />
      </Head>

      <Box
        bg="black"
        color="white"
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={{ base: 8, md: 12 }}
      >
        <Container maxW="7xl" position="relative">
          {/* Back button top-left */}
          <Box position="absolute" top={2} left={2}>
            <Link
              as={NextLink}
              href="/strategies/Alpha-stETH/manage"
              display="inline-flex"
              alignItems="center"
              gap={2}
              color="white"
              _hover={{ textDecoration: "underline", opacity: 0.9 }}
            >
              <ArrowLeftIcon boxSize={4} /> Back
            </Link>
          </Box>
          <Stack spacing={6} align="center" textAlign="center">
            <Text
              as="h1"
              textStyle="heroTitle"
              fontSize={{ base: "4xl", md: "6xl" }}
            >
              Alpha stETH — Deposit Guide
            </Text>
            <Text
              fontSize={{ base: "md", md: "lg" }}
              maxW="900px"
              color="whiteAlpha.800"
            >
              Dynamic leveraged stETH strategy powered by Somm + Lido.
              Watch the quick tutorial below.
            </Text>

            <Box w="100%" maxW="1200px">
              <AspectRatio ratio={16 / 9}>
                <video
                  src="/assets/tutorial/alpha_st_eth_deposit.mp4"
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="Alpha stETH Deposit Guide video"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                  }}
                />
              </AspectRatio>
            </Box>

            <Stack
              direction={{ base: "column", sm: "row" }}
              spacing={4}
              align="center"
              justify="center"
            >
              <Link
                href="/assets/tutorial/alpha_st_eth_deposit.mp4"
                download
                color="white"
                _hover={{ textDecoration: "underline", opacity: 0.9 }}
              >
                Download MP4
              </Link>
              <Link
                href="https://t.me/getsomm"
                isExternal
                color="white"
                _hover={{ textDecoration: "underline", opacity: 0.9 }}
              >
                Join Telegram
              </Link>
              <Link
                href="https://discord.com/invite/sommfinance"
                isExternal
                color="white"
                _hover={{ textDecoration: "underline", opacity: 0.9 }}
              >
                Need help? Join Discord
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </ChakraProvider>
  )
}

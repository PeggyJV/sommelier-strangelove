import Head from "next/head"
import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  AspectRatio,
  ChakraProvider,
  HStack,
  Spinner,
  Icon,
} from "@chakra-ui/react"
import theme from "src/theme"
import NextLink from "next/link"
import { ArrowLeftIcon } from "components/_icons/ArrowLeftIcon"
import ActionButton from "components/ui/ActionButton"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import { useAccount } from "wagmi"
// Note: analytics is imported dynamically in the click handler to avoid SSR issues
import { FaTelegramPlane, FaDiscord } from "react-icons/fa"
import { DEPOSIT_CTA_LABEL } from "src/libs/ctaLabels"

export default function AlphaStEthDepositGuidePage() {
  const router = useRouter()
  const { isConnected, chain } = useAccount()
  const [isOpening, setIsOpening] = useState(false)
  const [showSticky, setShowSticky] = useState(false)
  const videoRef = useRef<HTMLDivElement | null>(null)
  const videoElRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (!videoRef.current) return
    const el = videoRef.current
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        setShowSticky(!e.isIntersecting)
      },
      { root: null, threshold: 0.01 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Best-effort autoplay on mount (muted + inline for iOS/Safari)
  useEffect(() => {
    try {
      const v = videoElRef.current
      if (v) {
        // Ensure muted before attempting autoplay to satisfy browser policies
        v.muted = true
        v.volume = 1
        const p = v.play()
        if (p && typeof p.then === "function") {
          p.catch(() => {})
        }

        // Auto-unmute on first user interaction (required by most browsers)
        const onInteract = () => {
          try {
            v.muted = false
            v.volume = 1
            const p2 = v.play()
            if (p2 && typeof p2.then === "function")
              p2.catch(() => {})
          } catch {}
          window.removeEventListener("click", onInteract)
          window.removeEventListener("touchstart", onInteract)
          window.removeEventListener("keydown", onInteract)
        }
        window.addEventListener("click", onInteract, { once: true })
        window.addEventListener("touchstart", onInteract, {
          once: true,
        })
        window.addEventListener("keydown", onInteract, { once: true })
      }
    } catch {}
  }, [])

  const handleOpenDeposit = async (source: "main" | "sticky") => {
    try {
      setIsOpening(true)
      try {
        const { analytics } = await import("utils/analytics")
        analytics.track("cta_deposit_click", {
          page: "deposit_guide",
          wallet_connected: isConnected,
          network: chain?.id,
          source,
        })
      } catch {}
      await router.push(
        "/strategies/Alpha-stETH/manage?action=deposit"
      )
    } finally {
      setIsOpening(false)
    }
  }
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
          content="https://app.somm.finance/assets/tutorial/ALPHA_STETH.mp4"
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

            <Box
              w="100%"
              maxW="1200px"
              ref={videoRef}
              mb={{ base: 4, sm: 6 }}
            >
              <AspectRatio ratio={16 / 9}>
                <video
                  ref={videoElRef}
                  src="/assets/tutorial/ALPHA_STETH.mp4"
                  controls
                  playsInline
                  muted
                  autoPlay
                  preload="auto"
                  aria-label="Alpha stETH Deposit Guide video"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "12px",
                  }}
                />
              </AspectRatio>
              {/* CTA block under the video */}
              <Box
                mx="auto"
                w="full"
                maxW="4xl"
                px={{ base: 4, sm: 6 }}
                data-testid="alpha-deposit-guide-cta-block"
              >
                <Box
                  mt={{ base: 6, sm: 8 }}
                  display="flex"
                  w="full"
                  flexDirection="column"
                  alignItems="center"
                >
                  {/* Primary CTA as anchor for direct navigation */}
                  <Link
                    as={NextLink}
                    href="/strategies/Alpha-stETH/manage?action=deposit"
                    aria-label="Deposit to Alpha stETH"
                    role="group"
                    position="relative"
                    display="inline-flex"
                    w="full"
                    alignItems="center"
                    justifyContent="center"
                    rounded="2xl"
                    px={6}
                    py={4}
                    fontSize={{ base: "md", sm: "lg" }}
                    fontWeight={600}
                    color="white"
                    textDecoration="none"
                    transition="all 0.2s ease"
                    boxShadow="0 8px 24px rgba(0,0,0,0.35)"
                    _hover={{ textDecoration: "none" }}
                    _focusVisible={{
                      boxShadow:
                        "0 0 0 2px rgba(255,255,255,0.8), 0 0 0 4px rgba(0,0,0,1)",
                    }}
                    data-testid="alpha-deposit-cta"
                    onClick={() => {
                      // Fire analytics prior to navigation (best-effort)
                      try {
                        import("utils/analytics").then(
                          ({ analytics }) =>
                            analytics.track("cta_deposit_click", {
                              page: "deposit_guide",
                              source: "video_under_cta",
                            })
                        )
                      } catch {}
                    }}
                  >
                    <Text pointerEvents="none">
                      {DEPOSIT_CTA_LABEL}
                    </Text>
                    {/* gradient background via absolute Box */}
                    <Box
                      aria-hidden
                      position="absolute"
                      inset={0}
                      rounded="2xl"
                      zIndex={-1}
                      bgGradient="linear(to-r, #ff3d77, #a855f7, #6366f1)"
                    />
                  </Link>

                  {/* Subtext */}
                  <Text
                    mt={2}
                    textAlign="center"
                    fontSize={{ base: "15px", sm: "md" }}
                    color="whiteAlpha.700"
                    data-testid="alpha-deposit-subtext"
                  >
                    Opens the deposit modal on the Alpha stETH page
                  </Text>

                  {/* Secondary links */}
                  <HStack
                    mt={4}
                    alignItems="center"
                    spacing={6}
                    color="whiteAlpha.700"
                    data-testid="alpha-deposit-secondary-links"
                  >
                    <Link
                      href="https://t.me/getsomm"
                      isExternal
                      className="inline-flex"
                      _hover={{
                        color: "whiteAlpha.800",
                        textDecoration: "underline",
                      }}
                      _focusVisible={{
                        boxShadow:
                          "0 0 0 2px rgba(255,255,255,0.7), 0 0 0 4px rgba(0,0,0,1)",
                      }}
                      aria-label="Join Telegram"
                    >
                      <HStack as="span" spacing={2} align="center">
                        <Icon
                          as={FaTelegramPlane}
                          boxSize={4}
                          opacity={0.8}
                        />
                        <Text as="span">Join Telegram</Text>
                      </HStack>
                    </Link>
                    <Text as="span" color="whiteAlpha.400">
                      |
                    </Text>
                    <Link
                      href="https://discord.com/invite/sommfinance"
                      isExternal
                      className="inline-flex"
                      _hover={{
                        color: "whiteAlpha.800",
                        textDecoration: "underline",
                      }}
                      _focusVisible={{
                        boxShadow:
                          "0 0 0 2px rgba(255,255,255,0.7), 0 0 0 4px rgba(0,0,0,1)",
                      }}
                      aria-label="Join Discord"
                    >
                      <HStack as="span" spacing={2} align="center">
                        <Icon
                          as={FaDiscord}
                          boxSize={4}
                          opacity={0.8}
                        />
                        <Text as="span">Join Discord</Text>
                      </HStack>
                    </Link>
                  </HStack>
                </Box>
              </Box>
            </Box>
          </Stack>
        </Container>
      </Box>
      {showSticky && (
        <Box
          position="fixed"
          left={0}
          right={0}
          bottom={0}
          zIndex={500}
          bg="surface.bg"
          borderTopWidth="1px"
          borderColor="purple.dark"
          px={{ base: 4, md: 8 }}
          py={{ base: 3, md: 3 }}
        >
          <Container maxW="7xl" p={0}>
            <HStack
              justify="space-between"
              align="center"
              spacing={4}
            >
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="whiteAlpha.900"
                noOfLines={1}
              >
                Alpha stETH Deposit Guide
              </Text>
              <ActionButton
                variantStyle="primary"
                height={{ base: "44px", md: "44px" }}
                onClick={() => handleOpenDeposit("sticky")}
                aria-label="Deposit to Alpha stETH"
                minW={{ base: "160px", md: "200px" }}
                isDisabled={isOpening}
              >
                {isOpening ? (
                  <HStack spacing={2} justify="center">
                    <Spinner size="sm" />
                    <Text as="span">Opening deposit…</Text>
                  </HStack>
                ) : (
                  DEPOSIT_CTA_LABEL
                )}
              </ActionButton>
            </HStack>
          </Container>
        </Box>
      )}
    </ChakraProvider>
  )
}

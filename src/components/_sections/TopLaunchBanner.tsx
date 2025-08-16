import {
  Box,
  Stack,
  Text,
  Button,
  Link,
  Flex,
  HStack,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import { keyframes } from "@emotion/react"
import NextLink from "next/link"
import Countdown from "components/_common/Countdown"
import NextImage from "next/image"

type Props = {
  targetDate: Date
  blogHref?: string
}

export default function TopLaunchBanner({
  targetDate,
  blogHref = "#",
}: Props) {
  const lidoSrc = "/assets/images/eth-lido-uni.svg"
  const lidoFallbackPng = "/assets/icons/lido.png"

  return (
    <Box
      p="2px"
      rounded="2xl"
      bgGradient="linear(to-r, #6a0dad, #9b4dff)"
      mb={{ base: 6, md: 8 }}
    >
      <Box
        as="section"
        bgGradient="linear(to-r, banner.bg.start 0%, banner.bg.mid 45%, banner.bg.end 100%)"
        rounded="2xl"
        px={{ base: 4, md: 6 }}
        py={{ base: 4, md: 6, lg: 7 }}
        position="relative"
        overflow="hidden"
      >
        {/* GG icon bottom-right, non-blocking, hidden < md */}
        <Box
          aria-hidden
          position="absolute"
          right={{ base: 6, md: 6 }}
          bottom={{ base: 6, md: 6 }}
          pointerEvents="none"
          display={{ base: "none", md: "block" }}
        >
          <NextImage
            src="/assets/icons/GG.png"
            alt=""
            width={96}
            height={96}
            priority={false}
          />
        </Box>

        {/* Use Grid (not SimpleGrid) so templateColumns is respected */}
        <Grid
          templateColumns={{
            base: "1fr",
            lg: "minmax(0,1fr) minmax(260px,340px)",
          }}
          gap={{ base: 5, lg: 8 }}
          alignItems="start"
        >
          {/* LEFT COLUMN */}
          <GridItem>
            <Stack spacing={4} maxW="860px">
              {/* Single pill header (Launching + Lido) */}
              <HStack
                spacing={3}
                bg="chip.bg"
                px={3}
                py={1}
                rounded="full"
                w="fit-content"
              >
                <NextImage
                  src="/assets/icons/lido.png"
                  alt="Lido"
                  width={32}
                  height={32}
                  priority={false}
                />
                <Text
                  fontSize={{ base: "xs", md: "sm" }}
                  fontWeight={600}
                  color="chip.fg"
                >
                  Launching August 19
                </Text>

                {/* keep as Link (your current file links to lido.fi); remove Link wrapper if you want non-interactive */}
                <Link
                  href="https://lido.fi"
                  isExternal
                  _hover={{ textDecoration: "none" }}
                  aria-label="Lido official website"
                >
                  <HStack spacing={1.5} whiteSpace="nowrap">
                    <NextImage
                      src={lidoSrc}
                      alt="Lido"
                      width={20}
                      height={20}
                      priority={false}
                    />
                    <Text
                      fontSize={{ base: "xs", md: "sm" }}
                      fontWeight={600}
                      color="chip.fg"
                    >
                      Powered by Lido
                    </Text>
                  </HStack>
                </Link>
              </HStack>

              {/* Heading */}
              <Text
                as="h2"
                textStyle="heroTitle"
                fontSize={{ base: "3xl", md: "5xl" }}
                color="text.primary"
                mb={{ base: 2, md: 3 }}
              >
                Alpha stETH Vault
              </Text>

              {/* Mobile/Tablet countdown directly under heading */}
              <Box display={{ base: "block", lg: "none" }} mb={4}>
                <Countdown size="lg" targetDate={targetDate} />
              </Box>

              {/* Paragraph */}
              <Text textStyle="bodyMd" mt={{ base: 3, md: 4 }}>
                Built in collaboration with Lido, Alpha stETH offers
                simplified access to multiple Ethereum reward
                strategies through a single, composable vault.
              </Text>

              {/* Key-point pills (non-interactive) */}
              <HStack wrap="wrap" spacing={2} mb={5}>
                {[
                  "Blue-chip DeFi exposure",
                  "stETH rewards made simple",
                  "No legacy vault dependency",
                ].map((k) => (
                  <Text
                    key={k}
                    as="span"
                    bg="chip.bg"
                    color="chip.fg"
                    rounded="full"
                    px={3}
                    py={1}
                    fontSize="sm"
                    cursor="default"
                  >
                    {k}
                  </Text>
                ))}
              </HStack>

              {/* CTAs */}
              <HStack spacing={{ base: 3, md: 4 }}>
                <Button
                  as={NextLink}
                  href="/strategies/Alpha-stETH/manage"
                  size="md"
                  height="40px"
                  px="20px"
                  fontWeight={600}
                  fontSize="sm"
                  bg="cta.filled.bg"
                  color="cta.filled.fg"
                  _hover={{ bg: "whiteAlpha.800" }}
                  _active={{ bg: "whiteAlpha.900" }}
                  _focusVisible={{
                    boxShadow:
                      "0 0 0 3px var(--chakra-colors-purple-base)",
                  }}
                >
                  Explore Vault
                </Button>

                <Button
                  as={Link}
                  href={blogHref}
                  size="md"
                  height="40px"
                  px="20px"
                  fontWeight={600}
                  fontSize="sm"
                  variant="outline"
                  bg="transparent"
                  color="cta.outline.fg"
                  borderColor="cta.outline.br"
                  borderWidth="2px"
                  _hover={{
                    bg: "white",
                    color: "black",
                    borderColor: "white",
                  }}
                  _active={{
                    bg: "white",
                    color: "black",
                    borderColor: "white",
                  }}
                  _focusVisible={{
                    boxShadow:
                      "0 0 0 3px var(--chakra-colors-purple-base)",
                  }}
                >
                  View Strategy Blog
                </Button>
              </HStack>
            </Stack>
          </GridItem>

          {/* RIGHT COLUMN — desktop countdown */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <Flex align="flex-start" justify="flex-start">
              <Box
                position="relative"
                zIndex={1}
                maxW="100%"
                overflow="hidden"
                pr={2}
              >
                <Countdown size="lg" targetDate={targetDate} />
              </Box>
            </Flex>
          </GridItem>
        </Grid>

        {/* Scroll cue arrow (animated) */}
        {(() => {
          const bounceFade = keyframes`
          0%, 100% { transform: translate(-50%, 0); opacity: 0.6; }
          50% { transform: translate(-50%, 6px); opacity: 1; }
        `
          return (
            <Box
              aria-hidden
              position="absolute"
              left="50%"
              bottom={3}
              transform="translateX(-50%)"
              pointerEvents="none"
              as="svg"
              viewBox="0 0 24 24"
              boxSize={6}
              color="text.secondary"
              animation={`${bounceFade} 2.2s ease-in-out infinite`}
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Box>
          )
        })()}
      </Box>
    </Box>
  )
}

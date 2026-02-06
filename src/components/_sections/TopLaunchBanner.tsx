import {
  Box,
  Stack,
  Text,
  Button,
  Link,
  HStack,
  Grid,
  GridItem,
} from "@chakra-ui/react"
import NextLink from "next/link"
import * as React from "react"
import NextImage from "next/image"

type Props = {
  targetDate: Date
  blogHref?: string
}

export default function TopLaunchBanner({
  targetDate: _targetDate,
  blogHref = "https://somm.finance/blog/putting-steth-to-work-where-it-matters-most",
}: Props) {
  const lidoSrc = "/assets/images/eth-lido-uni.svg"

  // Static body text (no "Read more" control)
  function ExpandableBody({ text }: { text: string }) {
    return (
      <Box mt={{ base: 3, md: 4 }}>
        <Text textStyle="bodyMd">{text}</Text>
      </Box>
    )
  }

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
                {/* Launch date removed */}

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

              {/* One-line value proposition under title (clamped to 1 line) */}
              <Text
                fontSize={{ base: "sm", md: "md" }}
                color="text.secondary"
                noOfLines={1}
              >
                Dynamic leveraged stETH strategy powered by Somm +
                Lido.
              </Text>

              {/* Countdown disabled */}

              {/* Paragraph with clamp + Read more disclosure */}
              <ExpandableBody
                text={
                  "Built with Lido, Alpha stETH dynamically reallocates stETH across Aave, Morpho, Unichain, and Mellow to capture sustainable rewards. Automated risk controls and off-chain strategy computation ensure secure, efficient deployment."
                }
              />

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
              <Stack
                spacing={{ base: 2, md: 4 }}
                direction={{ base: "column", md: "row" }}
                w="full"
                overflow="visible"
              >
                <Button
                  as={NextLink}
                  href="/strategies/Alpha-stETH/manage"
                  size="md"
                  height={{ base: "44px", md: "40px" }}
                  px={{ base: 4, md: "20px" }}
                  w={{ base: "100%", md: "auto" }}
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

                {/* New CTA: Watch Deposit Guide */}
                <Button
                  as={NextLink}
                  href="/strategies/Alpha-stETH/deposit_guide"
                  size="md"
                  height={{ base: "44px", md: "40px" }}
                  px={{ base: 4, md: "20px" }}
                  w={{ base: "100%", md: "auto" }}
                  fontWeight={600}
                  fontSize="sm"
                  variant="outline"
                  bg="transparent"
                  color="cta.outline.fg"
                  borderColor="cta.outline.br"
                  borderWidth="2px"
                  _focusVisible={{
                    boxShadow:
                      "0 0 0 3px var(--chakra-colors-purple-base)",
                  }}
                >
                  Watch Deposit Guide
                </Button>

                <Link
                  href={blogHref}
                  isExternal
                  _hover={{ textDecoration: "none" }}
                  w={{ base: "100%", md: "auto" }}
                >
                  <Button
                    size="md"
                    height={{ base: "44px", md: "40px" }}
                    px={{ base: 4, md: "20px" }}
                    w={{ base: "100%", md: "auto" }}
                    fontWeight={600}
                    fontSize="sm"
                    variant="outline"
                    bg="transparent"
                    color="cta.outline.fg"
                    borderColor="cta.outline.br"
                    borderWidth="2px"
                    _focusVisible={{
                      boxShadow:
                        "0 0 0 3px var(--chakra-colors-purple-base)",
                    }}
                  >
                    View Strategy Blog
                  </Button>
                </Link>
              </Stack>
            </Stack>
          </GridItem>

          {/* RIGHT COLUMN — countdown disabled */}
          <GridItem
            display={{ base: "none", lg: "block" }}
          ></GridItem>
        </Grid>

        {/* Scroll cue arrow removed per request */}
      </Box>
    </Box>
  )
}

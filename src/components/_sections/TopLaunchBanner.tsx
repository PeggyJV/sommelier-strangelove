import {
  Box,
  Stack,
  Text,
  Button,
  Link,
  Flex,
  HStack,
  Image,
  SimpleGrid,
} from "@chakra-ui/react"
import NextLink from "next/link"
import Countdown from "components/_common/Countdown"

type Props = {
  targetDate: Date
  blogHref?: string
}

export default function TopLaunchBanner({
  targetDate,
  blogHref = "#",
}: Props) {
  // Use an existing SVG that includes Lido vector; fallback to PNG
  const lidoSrc = "/assets/images/eth-lido-uni.svg"
  const lidoFallbackPng = "/assets/icons/lido.png"

  return (
    <Box
      as="section"
      borderWidth="1px"
      borderColor="border.subtle"
      bg="surface.bg"
      rounded="xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 6, lg: 7 }}
      mb={{ base: 6, md: 8 }}
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
        <Image
          src="/assets/icons/GG.png"
          alt=""
          h={{ md: 12, lg: 16 }}
          w="auto"
          filter="drop-shadow(0 0 10px rgba(64,156,255,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.45))"
          opacity={0.7}
          mixBlendMode="screen"
        />
      </Box>

      {/* Grid: 1 col on md/sm, 2 cols on lg with fixed right width */}
      <SimpleGrid
        columns={{ base: 1, lg: 2 }}
        spacing={{ base: 5, lg: 8 }}
        templateColumns={{
          base: undefined,
          lg: "1fr minmax(300px,360px)",
        }}
        alignItems={{ base: "start", lg: "start" }}
      >
        {/* LEFT COLUMN - content */}
        <Stack spacing={4} maxW="860px">
          {/* Pill header */}
          <HStack
            spacing={3}
            bg="chip.bg"
            px={3}
            py={1}
            rounded="full"
            w="fit-content"
          >
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              fontWeight={600}
              color="chip.fg"
            >
              Launching August 19
            </Text>
            <HStack spacing={1.5} whiteSpace="nowrap">
              <Image
                src={lidoSrc}
                fallbackSrc={lidoFallbackPng}
                alt="Lido"
                h="1.05em"
                w="auto"
                verticalAlign="middle"
                style={{ transform: "translateY(-0.5px)" }}
                opacity={0.8}
                loading="eager"
                decoding="async"
              />
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                fontWeight={600}
                color="chip.fg"
              >
                Powered by Lido
              </Text>
            </HStack>
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

          {/* Countdown directly under heading on md/sm */}
          <Box display={{ base: "block", lg: "none" }} mb={4}>
            <Countdown size="lg" targetDate={targetDate} />
          </Box>

          {/* Paragraph */}
          <Text textStyle="bodyMd" mt={{ base: 3, md: 4 }}>
            Built in collaboration with Lido, Alpha stETH offers
            simplified access to multiple Ethereum reward strategies
            through a single, composable vault.
          </Text>

          {/* Key-point pills */}
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

        {/* RIGHT COLUMN - countdown on desktop */}
        <Flex
          display={{ base: "none", lg: "flex" }}
          align={{ lg: "flex-start" }}
          justify="flex-start"
        >
          <Countdown size="lg" targetDate={targetDate} />
        </Flex>
      </SimpleGrid>
    </Box>
  )
}

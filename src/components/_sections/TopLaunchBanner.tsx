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
      borderWidth="1px"
      borderColor="whiteAlpha.200"
      bgGradient="linear(to-r, blackAlpha.600, blackAlpha.500 40%, rgba(0,163,255,0.14) 75%, rgba(41,227,254,0.12))"
      rounded="xl"
      px={{ base: 4, md: 6 }}
      py={{ base: 5, md: 6 }}
      mb={{ base: 6, md: 8 }}
      position="relative"
      overflow="hidden"
    >
      {/* Subtle pattern overlays */}
      <Box aria-hidden position="absolute" top={{ base: "-10%", md: "-8%" }} right={{ base: "-10%", md: "-6%" }} w={{ base: 0, md: "38%" }} h={{ base: 0, md: "60%" }} opacity={0.08} bgImage="radial-gradient(circle at 50% 50%, rgba(41,227,254,0.9) 0px, rgba(41,227,254,0) 70%)" bgSize="120px 120px" bgRepeat="repeat" filter="blur(1px)" mixBlendMode="screen" pointerEvents="none" />
      <Box aria-hidden position="absolute" bottom={{ base: "-10%", md: "-8%" }} right={{ base: "-15%", md: "-10%" }} w={{ base: 0, md: "45%" }} h={{ base: 0, md: "55%" }} opacity={0.06} bgImage="radial-gradient(circle at 50% 50%, rgba(0,163,255,0.9) 0px, rgba(0,163,255,0) 70%)" bgSize="140px 140px" bgRepeat="repeat" filter="blur(1px)" mixBlendMode="screen" pointerEvents="none" />

      {/* GG icon bottom-right, non-blocking, hidden < md */}
      <Box aria-hidden position="absolute" right={{ base: 6, md: 6 }} bottom={{ base: 6, md: 6 }} pointerEvents="none" display={{ base: "none", md: "block" }}>
        <Image src="/assets/icons/GG.png" alt="" h={{ md: 12, lg: 16 }} w="auto" filter="drop-shadow(0 0 10px rgba(64,156,255,0.35)) drop-shadow(0 4px 12px rgba(0,0,0,0.45))" opacity={0.7} mixBlendMode="screen" />
      </Box>

      {/* Grid: 1 col on md/sm, 2 cols on lg with fixed right width */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={{ base: 6, lg: 8 }} templateColumns={{ base: undefined, lg: "1fr minmax(300px,360px)" }} alignItems={{ base: "start", lg: "start" }}>
        {/* LEFT COLUMN - content */}
        <Stack spacing={4} maxW="860px">
          {/* Header row */}
          <HStack spacing={{ base: 3, md: 3.5 }} align="center" flexWrap="nowrap">
            <Text fontWeight={600} fontSize={{ base: "sm", md: "md" }}>
              Launching August 19
            </Text>
            <HStack spacing={{ base: 2, md: 2 }} align="center" whiteSpace="nowrap">
              <Image src={lidoSrc} fallbackSrc={lidoFallbackPng} alt="Lido" h="1.08em" w="auto" verticalAlign="middle" style={{ transform: "translateY(-0.5px)" }} opacity={0.8} loading="eager" decoding="async" />
              <Text color="gray.300" fontSize={{ base: "xs", md: "sm" }}>
                Powered by Lido
              </Text>
            </HStack>
          </HStack>

          {/* Heading */}
          <Text as="h2" fontSize={{ base: "3xl", md: "5xl" }} fontWeight={800}>
            Alpha stETH Vault
          </Text>

          {/* Countdown directly under heading on md/sm */}
          <Box display={{ base: "block", lg: "none" }} mt={{ base: 3, md: 4 }}>
            <Countdown size="lg" targetDate={targetDate} />
          </Box>

          {/* Paragraph */}
          <Text color="gray.300" fontSize={{ base: "md", md: "lg" }} mt={{ base: 3, md: 4 }}>
            Built in collaboration with Lido, Alpha stETH offers simplified access to multiple Ethereum reward strategies through a single, composable vault.
          </Text>

          {/* Bullets */}
          <Stack direction={{ base: "column", md: "row" }} spacing={6} color="gray.200" mt={{ base: 3, md: 3 }}>
            <HStack spacing={2}>
              <Box as="span" boxSize={2} rounded="full" bg="green.400" />
              <Text>Blue-chip DeFi exposure</Text>
            </HStack>
            <HStack spacing={2}>
              <Box as="span" boxSize={2} rounded="full" bg="green.400" />
              <Text>stETH rewards made simple</Text>
            </HStack>
            <HStack spacing={2}>
              <Box as="span" boxSize={2} rounded="full" bg="green.400" />
              <Text>No legacy vault dependency</Text>
            </HStack>
          </Stack>

          {/* CTAs */}
          <HStack spacing={3} pt={{ base: 4, md: 4 }}>
            <Button as={NextLink} href="/strategies/Alpha-stETH/manage" variant="solid" size="lg">
              Explore Vault
            </Button>
            <Button as={Link} href={blogHref} variant="outline" size="lg">
              View Strategy Blog
            </Button>
          </HStack>
        </Stack>

        {/* RIGHT COLUMN - countdown on desktop */}
        <Flex display={{ base: "none", lg: "flex" }} align={{ lg: "flex-start" }} justify="flex-start">
          <Countdown size="lg" targetDate={targetDate} />
        </Flex>
      </SimpleGrid>
    </Box>
  )
}

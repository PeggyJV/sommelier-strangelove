import { Box, Stack, Text, VStack } from "@chakra-ui/react"
import Image from "next/image"

export type AlphaStethStatsCardProps = {
  tvlUsd: string
  netApyPercent: string
}

export default function AlphaStethStatsCard({
  tvlUsd,
  netApyPercent,
}: AlphaStethStatsCardProps) {
  return (
    <Box
      id="og-root"
      width="1200px"
      height="675px"
      position="relative"
      overflow="hidden"
      rounded="lg"
      bgImage="url('/assets/post_assets/background_1.svg')"
      bgSize="cover"
      bgPos="center"
      bgRepeat="no-repeat"
    >
      {/* Subtle bloom overlays */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w="60%"
        h="60%"
        bgGradient="radial(circle, rgba(108,78,217,0.25), rgba(0,0,0,0) 60%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="-10%"
        right="-10%"
        w="50%"
        h="50%"
        bgGradient="radial(circle, rgba(0,163,255,0.18), rgba(0,0,0,0) 60%)"
        pointerEvents="none"
      />

      <Stack
        position="absolute"
        inset={0}
        align="center"
        justify="space-between"
        py={12}
        px={12}
      >
        {/* Header */}
        <Text
          as="h1"
          fontFamily="heading"
          fontWeight={800}
          color="whiteAlpha.900"
          fontSize="64px"
          textAlign="center"
        >
          Alpha STETH
        </Text>

        {/* Center numbers */}
        <VStack spacing={4} align="center" justify="center">
          <Text
            fontFamily="heading"
            fontWeight={900}
            color="white"
            fontSize="92px"
            lineHeight={1}
            textAlign="center"
          >
            TVL ${tvlUsd}
          </Text>
          <Text
            fontFamily="heading"
            fontWeight={800}
            color="whiteAlpha.900"
            fontSize="56px"
            lineHeight={1}
            textAlign="center"
          >
            Net APY {netApyPercent}%
          </Text>
        </VStack>

        {/* Footer */}
        <VStack spacing={4} align="center">
          <Text
            fontFamily="body"
            fontWeight={500}
            color="neutral.300"
            fontSize="20px"
            textAlign="center"
          >
            Backed by Lido • Deployed on Aave, Morpho, Balancer
          </Text>

          {/* Brand lockup */}
          <VStack spacing={3} align="center">
            <Image
              src="/assets/post_assets/somm_logo.png"
              alt="Somm"
              width={180}
              height={40}
            />
            <Box w="220px" h="6px" bg="purple.base" rounded="full" />
          </VStack>
        </VStack>
      </Stack>
    </Box>
  )
}

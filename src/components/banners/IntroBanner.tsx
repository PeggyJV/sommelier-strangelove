import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react"
import NextImage from "next/image"
import NextLink from "next/link"
import { VideoBannerFrame } from "./VideoBannerFrame"

export function IntroBanner() {
  const lidoSrc = "/assets/images/eth-lido-uni.svg"

  return (
    <VideoBannerFrame>
      {/* Top-left pill */}
      <Box position="absolute" top={8} left={8}>
        <HStack
          spacing={3}
          bg="chip.bg"
          px={4}
          py={2}
          rounded="full"
          w="fit-content"
        >
          <NextImage
            src="/assets/icons/lido.png"
            alt="Lido"
            width={40}
            height={40}
          />
          <HStack spacing={2} whiteSpace="nowrap">
            <NextImage
              src={lidoSrc}
              alt="Lido"
              width={24}
              height={24}
            />
            <Text fontSize="md" fontWeight={700} color="chip.fg">
              Powered by Lido
            </Text>
          </HStack>
        </HStack>
      </Box>

      {/* Centered content with safe margins */}
      <Stack
        spacing={6}
        maxW="1400px"
        align="center"
        justify="center"
        height="full"
        textAlign="center"
        mx="auto"
        px="96px"
      >
        {/* Title + Tagline */}
        <VStack spacing={3}>
          <Text as="h1" textStyle="heroTitle" fontSize="72px" color="text.primary">
            Alpha stETH Deposit Guide
          </Text>
          <Text textStyle="bodyMd" fontSize="28px" color="text.secondary" noOfLines={2}>
            The simplest way to put Ethereum’s most trusted staking asset to work.
          </Text>
        </VStack>

        {/* Logos row */}
        <VStack spacing={2}>
          <HStack spacing={6} align="center">
            <NextImage src="/assets/icons/somm.svg" alt="Sommelier" width={160} height={40} />
            <NextImage src="/assets/icons/lido.png" alt="Lido" width={40} height={40} />
          </HStack>
          <Text fontSize="sm" color="text.secondary">Powered by Lido</Text>
        </VStack>

        {/* Protocol icons row (muted) */}
        <HStack spacing={8} opacity={0.8} display={{ base: "none", md: "flex" }}>
          <NextImage src="/assets/icons/aave2.svg" alt="Aave" width={32} height={32} />
          <NextImage src="/assets/icons/morpho.png" alt="Morpho" width={32} height={32} />
          <NextImage src="/assets/icons/uniswap.png" alt="Uniswap" width={32} height={32} />
          <NextImage src="/assets/icons/mellow.png" alt="Mellow" width={32} height={32} />
        </HStack>

        {/* Bottom center Somm logo */}
        <Box
          position="absolute"
          bottom={10}
          left="50%"
          transform="translateX(-50%)"
        >
          <NextImage
            src="/assets/icons/somm.svg"
            alt="Sommelier"
            width={160}
            height={40}
          />
        </Box>
      </Stack>
    </VideoBannerFrame>
  )
}

export default IntroBanner

import {
  Box,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"

// Desktop-only 1920×1080 composition matching the requested structure
export function AlphaStethIntroLikeRef() {
  const SOMM_MARK = "/assets/tutorial/GG.png"
  const SOMM_MARK_FALLBACK = "/assets/icons/GG.png"
  const LIDO_LOGO = "/assets/tutorial/lido.webp"
  const LIDO_LOGO_FALLBACK = "/assets/tutorial/lido.jpeg"

  const protocolLogos = [
    { src: "/assets/tutorial/aave.png", alt: "Aave" },
    { src: "/assets/tutorial/morpho.png", alt: "Morpho" },
    { src: "/assets/tutorial/uniswap.png", alt: "Uniswap" },
    { src: "/assets/tutorial/mellow.png", alt: "Mellow" },
  ]

  const textShadow = "0 2px 8px rgba(0,0,0,0.35)"

  return (
    <Box width="1920px" height="1080px">
      <Box
        p="2px"
        rounded="2xl"
        bgGradient="linear(to-r, #6a0dad, #9b4dff)"
        width="full"
        height="full"
      >
        <Box
          position="relative"
          rounded="2xl"
          overflow="hidden"
          width="full"
          height="full"
          bgGradient="linear(to-r, banner.bg.start 0%, banner.bg.mid 45%, banner.bg.end 100%)"
          px={16}
          py={16}
        >
          {/* Bottom-center watermark (GG) */}
          <Box
            position="absolute"
            bottom={8}
            left="50%"
            transform="translateX(-50%)"
            opacity={0.14}
            pointerEvents="none"
          >
            <Image
              src={SOMM_MARK}
              alt="Sommelier watermark"
              height="auto"
              width="140px"
              fallbackSrc={SOMM_MARK_FALLBACK}
            />
          </Box>

          {/* Centered vertical stack with comfortable top margin */}
          <Stack
            align="center"
            spacing={6}
            maxW="1400px"
            mx="auto"
            textAlign="center"
            pt="120px"
          >
            {/* Title + Subtitle */}
            <VStack spacing={5}>
              <Text
                as="h1"
                textStyle="heroTitle"
                fontSize="92px"
                color="#FFF"
                textShadow={textShadow}
              >
                Alpha stETH Deposit Guide
              </Text>
              <Text
                as="h2"
                textStyle="bodyMd"
                fontSize="30px"
                color="rgba(255,255,255,0.9)"
                lineHeight={1.35}
                maxW="1100px"
                textShadow={textShadow}
              >
                The simplest way to put Ethereum’s most trusted
                staking asset to work.
              </Text>
            </VStack>

            {/* Powered by */}
            <VStack spacing={4} pt={2}>
              <Text
                fontSize="15px"
                color="rgba(255,255,255,0.75)"
                letterSpacing="0.3px"
              >
                Powered by
              </Text>
              <HStack spacing={12} align="flex-end">
                <Image
                  src={SOMM_MARK}
                  alt="Sommelier mark"
                  height="48px"
                  width="auto"
                  fallbackSrc={SOMM_MARK_FALLBACK}
                />
                <Image
                  src={LIDO_LOGO}
                  alt="Lido logo"
                  height="48px"
                  width="auto"
                  fallbackSrc={LIDO_LOGO_FALLBACK}
                />
              </HStack>
            </VStack>

            {/* Protocol icons */}
            <HStack spacing={12} opacity={0.9} pt={4}>
              {protocolLogos.map((p) => (
                <Image
                  key={p.alt}
                  src={p.src}
                  alt={`${p.alt} logo`}
                  height="30px"
                  width="auto"
                />
              ))}
            </HStack>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}

export default AlphaStethIntroLikeRef

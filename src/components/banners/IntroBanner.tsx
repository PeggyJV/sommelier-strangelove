import { Box, HStack, Stack, Text } from "@chakra-ui/react"
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
        {/* Heading */}
        <Text
          as="h1"
          textStyle="heroTitle"
          fontSize="72px"
          color="text.primary"
        >
          Alpha stETH Deposit Guide
        </Text>

        {/* Subtitle */}
        <Text fontSize="32px" color="text.secondary">
          Dynamic leveraged stETH strategy powered by Somm + Lido.
        </Text>

        {/* Chips */}
        <HStack wrap="wrap" spacing={3}>
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
              px={4}
              py={2}
              fontSize="md"
              cursor="default"
            >
              {k}
            </Text>
          ))}
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

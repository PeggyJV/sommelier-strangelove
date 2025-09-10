import { Box, HStack, Link, Stack, Text } from "@chakra-ui/react"
import NextImage from "next/image"
import { VideoBannerFrame } from "./VideoBannerFrame"

export function OutroBanner() {
  return (
    <VideoBannerFrame>
      {/* Faint watermark (Ethereum alt or GG orb) */}
      <Box
        aria-hidden
        position="absolute"
        right={{ base: 16, md: 24 }}
        top={{ base: 16, md: 24 }}
        opacity={0.22}
        pointerEvents="none"
      >
        <NextImage
          src="/assets/icons/ethereum-alt.png"
          alt=""
          width={280}
          height={280}
        />
      </Box>

      {/* Centered content */}
      <Stack
        spacing={6}
        maxW="1400px"
        align="center"
        justify="center"
        height="full"
        textAlign="center"
        mx="auto"
      >
        <Text
          as="h1"
          textStyle="heroTitle"
          fontSize="72px"
          color="text.primary"
        >
          Thank you!
        </Text>
        <Text fontSize="32px" color="text.secondary" maxW="1100px">
          For any questions, visit somm.finance or join us on
          Telegram/Discord.
        </Text>

        {/* Community links row */}
        <HStack spacing={6} color="text.primary" fontSize="24px">
          <Link
            href="https://t.me/getsomm"
            isExternal
            _hover={{ textDecoration: "underline", opacity: 0.9 }}
          >
            t.me/getsomm
          </Link>
          <Text color="text.secondary">|</Text>
          <Link
            href="https://discord.com/invite/sommfinance"
            isExternal
            _hover={{ textDecoration: "underline", opacity: 0.9 }}
          >
            discord.gg/sommfinance
          </Link>
        </HStack>
      </Stack>

      {/* Bottom center Somm + Lido lockup */}
      <HStack
        position="absolute"
        bottom={10}
        left="50%"
        transform="translateX(-50%)"
        spacing={6}
        bg="chip.bg"
        px={4}
        py={2}
        rounded="full"
      >
        {/* Optional glow */}
        <Box
          position="absolute"
          inset={0}
          filter="blur(16px)"
          opacity={0.25}
          zIndex={0}
        />
        <NextImage
          src="/assets/icons/somm.svg"
          alt="Sommelier"
          width={140}
          height={34}
        />
        <Text color="chip.fg" fontWeight={700} fontSize="sm">
          +
        </Text>
        <NextImage
          src="/assets/icons/lido.png"
          alt="Lido"
          width={34}
          height={34}
        />
      </HStack>
    </VideoBannerFrame>
  )
}

export default OutroBanner

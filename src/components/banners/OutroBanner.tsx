import { HStack, Link, Stack, Text } from "@chakra-ui/react"
import { BannerFrame } from "./BannerFrame"
import NextImage from "next/image"

export function OutroBanner() {
  return (
    <BannerFrame showPill={false} contentOffsetY={-40}>
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
        <HStack spacing={3} bg="chip.bg" px={3} py={1} rounded="full">
          <NextImage
            src="/assets/icons/lido.png"
            alt="Lido"
            width={24}
            height={24}
          />
          <Text fontSize="sm" fontWeight={600} color="chip.fg">
            Powered by Lido
          </Text>
        </HStack>
        <Text
          as="h1"
          textStyle="heroTitle"
          fontSize="72px"
          color="text.primary"
        >
          Alpha stETH Deposit Guide
        </Text>
        <Text fontSize="32px" color="text.secondary" maxW="1100px">
          You’re ready to start.
        </Text>
        <Text fontSize="24px" color="text.secondary" maxW="1100px">
          Make your first deposit today and put your stETH to work
          with Somm + Lido. Secure, dynamic, and built on Ethereum’s
          most trusted protocols.
        </Text>
        <Text fontSize="28px" fontWeight={700} color="text.primary">
          👉 Start now at
          app.somm.finance/strategies/Alpha-stETH/manage
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
    </BannerFrame>
  )
}

export default OutroBanner

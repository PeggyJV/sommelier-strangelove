import { Box, Text, HStack, Link, Icon, IconProps } from "@chakra-ui/react"

function InfoIcon(props: IconProps) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
      />
    </Icon>
  )
}

const linkProps = {
  isExternal: true,
  color: "neutral.200",
  textDecoration: "underline",
  textUnderlineOffset: "2px",
  _hover: { color: "neutral.100" },
} as const

export default function WithdrawalWarningBanner() {
  return (
    <Box
      borderWidth="1px"
      borderColor="surface.quartnerary"
      borderLeftWidth="3px"
      borderLeftColor="purple.base"
      bg="surface.tertiary"
      rounded="xl"
      px={{ base: 4, md: 5 }}
      py={4}
      fontSize="sm"
      color="neutral.300"
    >
      <HStack spacing={2} mb={2} align="center">
        <InfoIcon color="purple.light" boxSize={4} />
        <Text fontWeight={600} color="neutral.100">
          Withdrawals – Legacy Vaults Update
        </Text>
      </HStack>

      <Text>
        <Text as="span" color="neutral.200" fontWeight={600}>
          Real Yield ETH
        </Text>{" "}
        and{" "}
        <Text as="span" color="neutral.200" fontWeight={600}>
          Turbo stETH
        </Text>{" "}
        withdrawals are temporarily unavailable due to a stale price
        oracle. Deposited funds are safe and remain fully accounted for
        on-chain. We expect withdrawals to be enabled by October 6, 2026,
        subject to final validation. Availability may vary by vault.
        Other vaults are currently being worked on.
      </Text>

      <Text mt={3}>
        Vault-specific updates:{" "}
        <Link href="https://discord.gg/veda" {...linkProps}>
          Veda Discord
        </Link>
        {" · "}
        <Link href="https://x.com/veda_labs" {...linkProps}>
          Veda X
        </Link>
        <Box as="span" mx={3} color="neutral.600">
          |
        </Box>
        General Somm support:{" "}
        <Link href="https://t.me/getsomm" {...linkProps}>
          Telegram
        </Link>
        {" · "}
        <Link href="https://x.com/sommfinance" {...linkProps}>
          X
        </Link>
      </Text>
    </Box>
  )
}

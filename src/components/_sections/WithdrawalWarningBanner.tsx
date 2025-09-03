import {
  Box,
  Text,
  Heading,
  Link,
  HStack,
  OrderedList,
  ListItem,
  Icon,
} from "@chakra-ui/react"

function WarningIcon(props: any) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path fill="currentColor" d="M1 21h22L12 2 1 21z" />
      <path fill="currentColor" d="M13 16h-2v2h2zm0-6h-2v4h2z" />
    </Icon>
  )
}

export default function WithdrawalWarningBanner() {
  return (
    <Box
      border="1px solid"
      borderColor="orange.500"
      bg="orange.900"
      color="orange.100"
      borderRadius="lg"
      p={6}
      mt={8}
    >
      <HStack spacing={3} mb={4} align="center">
        <WarningIcon color="orange.400" boxSize={5} />
        <Heading size="md" color="orange.300">
          Withdrawals – Legacy Vaults
        </Heading>
      </HStack>

      <Text mb={4}>
        These vaults are currently undergoing deleveraging due to ETH
        liquidity constraints. They are managed by Veda (formerly
        Seven Seas).
      </Text>

      <Text fontWeight="semibold" mb={2}>
        For vault-specific updates, contact Veda directly:
      </Text>
      <HStack spacing={6} mb={4}>
        <Link
          href="https://discord.com/invite/hT4FZZTBdq"
          isExternal
          color="blue.300"
        >
          Veda Discord
        </Link>
        <Link
          href="https://x.com/veda_labs"
          isExternal
          color="blue.300"
        >
          Veda X
        </Link>
      </HStack>

      {/* Status list removed per request */}

      <Text fontWeight="semibold" mb={2}>
        For general Somm support or questions about new vaults:
      </Text>
      <HStack spacing={6}>
        <Link href="https://t.me/getsomm" isExternal color="blue.300">
          Telegram
        </Link>
        <Link
          href="https://x.com/sommfinance"
          isExternal
          color="blue.300"
        >
          X
        </Link>
      </HStack>
    </Box>
  )
}

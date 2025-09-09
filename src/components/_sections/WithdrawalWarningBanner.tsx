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
          Withdrawals – Legacy Vaults Update
        </Heading>
      </HStack>

      <Text mb={4}>
        Important updates regarding legacy vault withdrawals and
        migrations:
      </Text>

      <OrderedList spacing={3} mb={4}>
        <ListItem>
          <Text>
            <Text as="span" fontWeight="semibold" color="green.300">
              Real Yield ETH
            </Text>{" "}
            is now fully available for withdrawal. Users are
            encouraged to migrate to{" "}
            <Text as="span" fontWeight="semibold">
              AlphaStETH
            </Text>
            .
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            <Text as="span" fontWeight="semibold" color="yellow.300">
              TurboStETH
            </Text>{" "}
            – Please enter the withdrawal queue.
          </Text>
        </ListItem>
        <ListItem>
          <Text>
            <Text as="span" fontWeight="semibold">
              Other vaults
            </Text>{" "}
            are currently being worked on.
          </Text>
        </ListItem>
      </OrderedList>

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

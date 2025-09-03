import {
  Box,
  Button,
  HStack,
  ListItem,
  OrderedList,
  Text,
} from "@chakra-ui/react"

export default function WithdrawalStatusPanel() {
  return (
    <Box
      bg="orange.900"
      border="1px solid"
      borderColor="orange.500"
      color="orange.100"
      p={4}
      borderRadius="lg"
      mt={6}
      mb={4}
    >
      <Text fontWeight="semibold">Withdrawals and migrations</Text>
      <OrderedList mt={2} spacing={1} pl={4}>
        <ListItem>
          Legacy vaults are paused. No new deposits.
        </ListItem>
        <ListItem>
          Use “Enter Withdrawal” to queue exits if enabled.
        </ListItem>
        <ListItem>
          Support and updates in Veda Discord and X.
        </ListItem>
      </OrderedList>
      <HStack mt={3} spacing={3}>
        <Button
          as="a"
          href="https://discord.gg/veda"
          size="sm"
          target="_blank"
          rel="noreferrer noopener"
        >
          Discord
        </Button>
        <Button
          as="a"
          href="https://x.com/veda"
          size="sm"
          variant="outline"
          target="_blank"
          rel="noreferrer noopener"
        >
          X updates
        </Button>
      </HStack>
    </Box>
  )
}

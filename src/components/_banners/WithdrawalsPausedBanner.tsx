import { FC } from "react"
import { HStack, VStack, Text, Link, Icon } from "@chakra-ui/react"

/**
 * Shown while the live redemption probe cannot confirm that a recovery vault
 * is withdrawable. Say so plainly rather than letting users burn gas on a
 * transaction that is expected to revert.
 */
export const WithdrawalsPausedBanner: FC = () => {
  return (
    <HStack
      p={4}
      spacing={4}
      align="flex-start"
      justify="center"
      backgroundColor="orange.900"
      border="2px solid"
      borderRadius="1em"
      borderColor="orange.400"
    >
      <Icon viewBox="0 0 24 24" boxSize={5} color="orange.300" mt={1}>
        <path fill="currentColor" d="M1 21h22L12 2 1 21z" />
        <path fill="currentColor" d="M13 16h-2v2h2zm0-6h-2v4h2z" />
      </Icon>
      <VStack align="flex-start" spacing={2}>
        <Text fontWeight="bold" color="orange.200">
          Withdrawals temporarily unavailable
        </Text>
        <Text color="orange.100">
          This vault is not yet passing the live withdrawal check.
          Withdrawals will become available automatically once an
          on-chain redemption preview succeeds.
        </Text>
        <Text color="orange.100">
          The team is actively working on a fix. Follow{" "}
          <Link
            href="https://x.com/sommfinance"
            isExternal
            textDecoration="underline"
          >
            @sommfinance
          </Link>{" "}
          for updates.
        </Text>
      </VStack>
    </HStack>
  )
}

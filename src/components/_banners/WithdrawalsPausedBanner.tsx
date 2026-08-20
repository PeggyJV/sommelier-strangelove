import { FC } from "react"
import { HStack, VStack, Text, Link, Icon } from "@chakra-ui/react"

/**
 * Shown on the vault page for any vault in WITHDRAWALS_PAUSED_SLUGS.
 *
 * Redemptions on these vaults revert on-chain, so the withdraw form cannot
 * succeed. Say so plainly rather than letting users burn gas on a call that
 * always reverts.
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
          Withdrawals from Real Yield ETH and Turbo stETH are
          temporarily unavailable due to a stale price oracle.
          Deposited funds are safe and remain fully accounted for
          on-chain.
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

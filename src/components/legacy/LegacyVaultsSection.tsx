import { Box, VStack } from "@chakra-ui/react"
import SectionHeader from "components/_sections/SectionHeader"
import WithdrawalWarningBanner from "components/_sections/WithdrawalWarningBanner"
import LegacyVaultCard from "components/_vaults/LegacyVaultCard"
import { StrategyData } from "data/actions/types"

interface LegacyVaultsSectionProps {
  legacyVaults: StrategyData[]
  enabled: boolean
}

export default function LegacyVaultsSection({
  legacyVaults,
  enabled,
}: LegacyVaultsSectionProps) {
  // If no legacy vaults, don't render anything
  if (legacyVaults.length === 0) {
    return null
  }

  return (
    <Box as="section" id="legacy-vaults">
      <SectionHeader
        title={
          <>
            Legacy Vaults (Managed by{" "}
            <a
              href="https://sevenseas.capital/"
              target="_blank"
              rel="noreferrer noopener"
              style={{ textDecoration: "underline" }}
            >
              Seven Seas
            </a>
            )
          </>
        }
      />
      <WithdrawalWarningBanner />
      <VStack spacing={4} align="stretch" mt={2}>
        {legacyVaults
          .filter((v): v is NonNullable<typeof v> => v !== null)
          .map((v) => (
            <LegacyVaultCard
              key={v?.slug ?? v?.name}
              vault={v}
              enabled={enabled}
            />
          ))}
      </VStack>
    </Box>
  )
}

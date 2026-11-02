import { Box, Grid, Heading, Link, Text } from "@chakra-ui/react"
import WithdrawalWarningBanner from "components/_sections/WithdrawalWarningBanner"
import LegacyVaultCard from "components/_vaults/LegacyVaultCard"
import { StrategyData } from "data/actions/types"

interface LegacyVaultsSectionProps {
  legacyVaults: StrategyData[]
  enabled: boolean
}

const columnLabel = {
  fontSize: "xs",
  fontWeight: 600,
  color: "neutral.500",
  textTransform: "uppercase",
  letterSpacing: "0.06em",
} as const

export default function LegacyVaultsSection({
  legacyVaults,
  enabled,
}: LegacyVaultsSectionProps) {
  const vaults = legacyVaults.filter(
    (v): v is NonNullable<typeof v> => v !== null
  )
  if (vaults.length === 0) return null

  return (
    <Box as="section" id="legacy-vaults" overflow="visible" mt={8}>
      <Box mb={4}>
        <Heading as="h2" size="md" fontWeight={700}>
          Legacy Vaults
        </Heading>
        <Text fontSize="sm" color="neutral.400" mt={1}>
          {vaults.length} vaults managed by{" "}
          <Link
            href="https://sevenseas.capital/"
            isExternal
            color="neutral.300"
            textDecoration="underline"
          >
            Seven Seas
          </Link>{" "}
          and partners. Withdrawal only.
        </Text>
      </Box>

      <WithdrawalWarningBanner />

      <Box
        mt={4}
        borderWidth="1px"
        borderColor="surface.secondary"
        bg="surface.primary"
        rounded="xl"
        overflow="hidden"
      >
        <Grid
          display={{ base: "none", md: "grid" }}
          templateColumns="minmax(0,260px) 140px 100px minmax(0,1fr)"
          columnGap={4}
          px={5}
          py={2}
          borderBottomWidth="1px"
          borderColor="surface.secondary"
          bg="blackAlpha.200"
        >
          <Text {...columnLabel}>Vault</Text>
          <Text {...columnLabel}>Network</Text>
          <Text {...columnLabel} textAlign="right">
            Net Rewards
          </Text>
          <Box />
        </Grid>
        <Box
          sx={{
            "& > * + *": {
              borderTopWidth: "1px",
              borderColor: "surface.secondary",
            },
          }}
        >
          {vaults.map((v) => (
            <LegacyVaultCard
              key={v?.slug ?? v?.name}
              vault={v}
              enabled={enabled}
            />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

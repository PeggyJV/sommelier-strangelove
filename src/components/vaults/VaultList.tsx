import { useMemo } from "react"
import { VStack } from "@chakra-ui/react"
import { sortVaults } from "utils/sortVaults"
import LegacyVaultCard from "components/_vaults/LegacyVaultCard"
import StrategyRow from "components/_vaults/StrategyRow"
import { useAccount } from "wagmi"

export default function VaultList({ vaults }: { vaults: any[] }) {
  const { isConnected } = useAccount()
  const sorted = useMemo(
    () =>
      sortVaults(
        vaults.map((v) => ({
          ...v,
          metrics: { tvl: Number(v?.tvm?.value ?? 0) },
          user: {
            netValue: Number(
              v?.userStrategyData?.userData?.netValue?.value ?? 0
            ),
          },
        })),
        isConnected
      ),
    [isConnected, vaults]
  )

  return (
    <VStack spacing={4} align="stretch">
      {sorted.map((v) =>
        v?.isSommNative ? (
          <StrategyRow key={v?.slug ?? v?.name} vault={v} />
        ) : (
          <LegacyVaultCard key={v?.slug ?? v?.name} vault={v} />
        )
      )}
    </VStack>
  )
}

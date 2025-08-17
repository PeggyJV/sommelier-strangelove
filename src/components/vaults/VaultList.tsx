import { useMemo } from "react"
import { VStack } from "@chakra-ui/react"
import { getSortedVaults } from "state/vaults/selectors"
import LegacyVaultCard from "components/_vaults/LegacyVaultCard"
import StrategyRow from "components/_vaults/StrategyRow"
import { useAccount } from "wagmi"

export default function VaultList({ vaults }: { vaults: any[] }) {
  const { isConnected } = useAccount()
  const sorted = useMemo(
    () => getSortedVaults(isConnected, vaults),
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

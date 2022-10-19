import { useQuery } from "@tanstack/react-query"
import { getCurrentDeposits as getCurrentDeposits_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getCurrentDeposits"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"

export const useCurrentDeposits = (config: ConfigProps) => {
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id.toLowerCase(),
      cellarString: config.id.toLowerCase(),
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const { addedLiquidityAllTime, removedLiquidityAllTime, asset } =
    cellar || {}

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      asset?.symbol &&
      addedLiquidityAllTime &&
      removedLiquidityAllTime
  )

  const query = useQuery(
    [
      "USE_CURRENT_DEPOSITS",
      addedLiquidityAllTime,
      removedLiquidityAllTime,
      config.cellar.address,
    ],
    async () => {
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getCurrentDeposits_AAVE_V2_STABLE_CELLAR({
          assetSymbol: asset?.symbol,
          addedLiquidityAllTime,
          removedLiquidityAllTime,
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED, // branching example: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED || V1_5_CELLAR_QUERY_ENABLED
    }
  )

  return query
}

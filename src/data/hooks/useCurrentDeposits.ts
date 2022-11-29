import { useQuery } from "@tanstack/react-query"
import { getCurrentDeposits } from "data/actions/common/getCurrentDeposits"
import { CellarNameKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"

export const useCurrentDeposits = (config: ConfigProps) => {
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const { addedLiquidityAllTime, removedLiquidityAllTime, asset } =
    cellar || {}

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellarNameKey === CellarNameKey.AAVE &&
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
      if (config.cellarNameKey === CellarNameKey.AAVE) {
        return await getCurrentDeposits({
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

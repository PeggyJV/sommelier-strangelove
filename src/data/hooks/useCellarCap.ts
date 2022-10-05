import { useQuery } from "@tanstack/react-query"
import { getCellarCap as getCellarCap_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getCellarCap"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"

export const useCellarCap = (config: ConfigProps) => {
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const { liquidityLimit, asset } = cellar || {}

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      asset?.decimals &&
      asset?.symbol &&
      liquidityLimit
  )

  const query = useQuery(
    ["USE_CELLAR_CAP", config.cellar.address, liquidityLimit],
    async () => {
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getCellarCap_AAVE_V2_STABLE_CELLAR({
          assetDecimals: asset?.decimals,
          assetSymbol: asset?.symbol,
          liquidityLimit,
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

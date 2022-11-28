import { useQuery } from "@tanstack/react-query"
import { getCellarCap as getCellarCap__AAVE_V2_STABLE_CELLAR } from "data/actions/common/getCellarCap"
import { CellarNameKey, ConfigProps } from "data/types"
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
    config.cellarNameKey === CellarNameKey.AAVE &&
      asset?.decimals &&
      asset?.symbol &&
      liquidityLimit
  )

  const query = useQuery(
    ["USE_CELLAR_CAP", liquidityLimit, config.cellar.address],
    async () => {
      if (config.cellarNameKey === CellarNameKey.AAVE) {
        return await getCellarCap__AAVE_V2_STABLE_CELLAR({
          assetDecimals: asset?.decimals,
          assetSymbol: asset?.symbol,
          liquidityLimit,
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED,
    }
  )

  return query
}

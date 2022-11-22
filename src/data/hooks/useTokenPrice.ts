import { useQuery } from "@tanstack/react-query"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"
import { formatDecimals } from "utils/bigNumber"
import { useCreateContracts } from "./useCreateContracts"

export const useTokenPrice = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })

  const { data } = cellarResult
  const { cellar } = data || {}
  const { shareValue } = cellar || {}

  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.PATACHE_LINK ||
      config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) &&
      cellarContract.provider &&
      shareValue
  )

  const query = useQuery(
    ["USE_TOKEN_PRICE", shareValue, config.cellar.address],
    async () => {
      if (!shareValue) throw new Error("shareValue undefined")
      const tokenPrice = formatDecimals(shareValue, 6, 2)
      if (
        config.cellar.key === CellarKey.PATACHE_LINK ||
        config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
      ) {
        return `$${tokenPrice}`
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}

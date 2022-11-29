import { useQuery } from "@tanstack/react-query"
import { CellarNameKey, ConfigProps } from "data/types"
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

  const isEnabled =
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH

  const queryEnabled = Boolean(
    isEnabled && cellarContract.provider && shareValue
  )

  const query = useQuery(
    ["USE_TOKEN_PRICE", shareValue, config.cellar.address],
    async () => {
      if (!shareValue) throw new Error("shareValue undefined")
      if (isEnabled) {
        const tokenPrice = formatDecimals(shareValue, 6, 2)
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

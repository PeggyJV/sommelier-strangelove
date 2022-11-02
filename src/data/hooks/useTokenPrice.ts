import { useQuery } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"
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
    (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
      config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) &&
      cellarContract.provider &&
      shareValue
  )

  const query = useQuery(
    ["USE_TOKEN_PRICE", shareValue, config.cellar.address],
    async () => {
      const shareValueBN = new BigNumber(String(shareValue))
      const tokenPrice = shareValueBN.div(1000000).toFixed(2) // 1e6, USDC decimals
      if (
        config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
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

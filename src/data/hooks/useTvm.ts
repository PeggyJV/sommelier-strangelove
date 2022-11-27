import { useQuery } from "@tanstack/react-query"
import { getTvm } from "data/actions/common/getTvm"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"
import { useCreateContracts } from "./useCreateContracts"

export const useTvm = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })

  const { data } = cellarResult
  const { cellar } = data || {}
  const { tvlTotal } = cellar || {}

  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.CELLAR_V0815 ||
      config.cellar.key === CellarKey.CELLAR_V0816) &&
      cellarContract.provider &&
      tvlTotal
  )

  const query = useQuery(
    ["USE_TVM", tvlTotal, config.cellar.address],
    async () => {
      if (
        config.cellar.key === CellarKey.CELLAR_V0815 ||
        config.cellar.key === CellarKey.CELLAR_V0816
      ) {
        return await getTvm(tvlTotal)
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}

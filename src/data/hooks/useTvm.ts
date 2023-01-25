import { useQuery } from "@tanstack/react-query"
import { getTotalAssets } from "data/actions/common/getTotalAssets"
import { getTvm } from "data/actions/common/getTvm"
import { CellarKey, ConfigProps } from "data/types"
import { useGetCellarQuery } from "generated/subgraph"
import { useActiveAsset } from "./useActiveAsset"
import { useCreateContracts } from "./useCreateContracts"

export const useTvm = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: config.id,
      cellarString: config.id,
    },
  })

  const activeAsset = useActiveAsset(config)

  const { data } = cellarResult
  const { cellar } = data || {}
  const { tvlTotal } = cellar || {}

  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.CELLAR_V0815 ||
      config.cellar.key === CellarKey.CELLAR_V0816) &&
      cellarContract.provider &&
      (tvlTotal || activeAsset.data)
  )
  const query = useQuery(
    ["USE_TVM", config.cellar.address, activeAsset.data, tvlTotal],
    async () => {
      if (
        config.cellar.key === CellarKey.CELLAR_V0815 ||
        config.cellar.key === CellarKey.CELLAR_V0816
      ) {
        if (tvlTotal) {
          return await getTvm(tvlTotal)
        }
        if (!activeAsset.data) {
          throw new Error("NO ACTIVE ASSET")
        }
        return await getTotalAssets(cellarContract, activeAsset.data)
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}

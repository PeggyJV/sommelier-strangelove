import { useQuery } from "@tanstack/react-query"
import { getTotalAssets } from "data/actions/common/getTotalAssets"
import { CellarKey, ConfigProps } from "data/types"
import { useActiveAsset } from "./useActiveAsset"
import { useCreateContracts } from "./useCreateContracts"

export const useTvm = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const { data: activeAsset } = useActiveAsset(config)
  const queryEnabled = Boolean(
    (config.cellar.key === CellarKey.CELLAR_V0815 ||
      config.cellar.key === CellarKey.CELLAR_V0816 ||
      config.cellar.key === CellarKey.CELLAR_V2) &&
      cellarContract.provider &&
      activeAsset
  )
  const query = useQuery(
    ["USE_TVM", config.cellar.address, activeAsset],
    async () => {
      if (
        config.cellar.key === CellarKey.CELLAR_V0815 ||
        config.cellar.key === CellarKey.CELLAR_V0816 ||
        config.cellar.key === CellarKey.CELLAR_V2
      ) {
        if (!activeAsset) {
          throw new Error("NO ACTIVE ASSET")
        }
        return await getTotalAssets(cellarContract, activeAsset)
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}

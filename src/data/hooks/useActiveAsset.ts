import { useQuery } from "@tanstack/react-query"
import { getActiveAsset } from "data/actions/common/getActiveAsset"
import { CellarKey, ConfigProps } from "data/types"
import { useCreateContracts } from "./useCreateContracts"

export const useActiveAsset = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const activeAssetQueryEnabled = Boolean(
    (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
      config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) &&
      cellarContract.provider
  )

  const query = useQuery(
    ["USE_ACTIVE_ASSET"],
    async () => {
      if (
        config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR ||
        config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
      ) {
        return await getActiveAsset(cellarContract)
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: activeAssetQueryEnabled,
    }
  )

  return query
}

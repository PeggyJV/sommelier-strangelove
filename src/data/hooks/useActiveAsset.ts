import { useQuery } from "@tanstack/react-query"
import { getActiveAsset as getActiveAsset_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getActiveAsset"
import { CellarKey, ConfigProps } from "data/types"
import { AaveV2CellarV2 } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"

export const useActiveAsset = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      cellarContract.provider
  )

  const query = useQuery(
    ["USE_ACTIVE_ASSET"],
    async () => {
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getActiveAsset_AAVE_V2_STABLE_CELLAR(
          cellarContract as AaveV2CellarV2
        )
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED, // branching example: AAVE_V2_STABLE_CELLAR_QUERY_ENABLED || V1_5_CELLAR_QUERY_ENABLED
    }
  )

  return query
}

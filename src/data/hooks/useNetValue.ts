import { useQuery } from "@tanstack/react-query"
import { getNetValue as getNetValue_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getNetValue"
import { useCreateContracts } from "./useCreateContracts"
import { useToken } from "wagmi"
import { useActiveAsset } from "./useActiveAsset"
import { useUserBalances } from "./useUserBalances"
import { useUserStakes } from "./useUserStakes"
import { CellarKey, ConfigProps } from "data/types"

export const useNetValue = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const { lpToken } = useUserBalances(config)

  const { data: userStakes } = useUserStakes(config)
  const { data: activeAssetRes } = useActiveAsset(config)
  const { data: activeAsset } = useToken({
    address: activeAssetRes?.address,
    chainId: 1,
  })

  const AAVE_V2_STABLE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR &&
      cellarContract.provider &&
      userStakes &&
      activeAsset &&
      lpToken.data?.formatted
  )

  const query = useQuery(
    ["USE_NET_VALUE", config.cellar.address, lpToken.data?.formatted],
    async () => {
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getNetValue_AAVE_V2_STABLE_CELLAR({
          activeAsset: activeAsset,
          cellarContract,
          lpToken: lpToken.data?.formatted,
          userStakes: userStakes,
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

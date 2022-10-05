import { useQuery } from "@tanstack/react-query"
import { getNetValue as getNetValue_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getNetValue"
import { useCreateContracts } from "./useCreateContracts"
import { useToken } from "wagmi"
import { useActiveAsset } from "./useActiveAsset"
import { useUserBalances } from "./useUserBalances"
import { useUserStakes } from "./useUserStakes"
import { CellarKey, ConfigProps } from "data/types"
import { getNetValue as getNetValue_CLEAR_GATE_CELLAR } from "data/actions/CLEAR_GATE_CELLAR/getNetValue"

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

  const CLEAR_GATE_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.CLEAR_GATE_CELLAR &&
      lpToken.data?.value
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
      if (config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) {
        if (!lpToken.data?.value) {
          throw new Error("lpToken is undefined")
        }
        return getNetValue_CLEAR_GATE_CELLAR(lpToken.data?.value)
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled:
        AAVE_V2_STABLE_CELLAR_QUERY_ENABLED ||
        CLEAR_GATE_CELLAR_QUERY_ENABLED,
    }
  )

  return query
}

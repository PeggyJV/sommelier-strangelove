import { useQuery } from "@tanstack/react-query"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount, useToken } from "wagmi"
import { useActiveAsset } from "./useActiveAsset"
import { useUserBalances } from "./useUserBalances"
import { useUserStakes } from "./useUserStakes"
import { CellarKey, ConfigProps } from "data/types"
import { getNetValue as getNetValue_CLEAR_GATE_CELLAR } from "data/actions/CLEAR_GATE_CELLAR/getNetValue"
import { getNetValue as getNetValue_AAVE_V2_STABLE_CELLAR } from "data/actions/AAVE_V2_STABLE_CELLAR/getNetValue"
import { getNetValue as getNetValue_PATACHE_LINK } from "data/actions/PATACHE_LINK/getNetValue"

export const useNetValue = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const { lpToken } = useUserBalances(config)
  const { address } = useAccount()

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
      activeAsset &&
      address
  )

  const PATACHE_LINK_CELLAR_QUERY_ENABLED = Boolean(
    config.cellar.key === CellarKey.PATACHE_LINK &&
      cellarContract.provider &&
      userStakes &&
      activeAsset &&
      lpToken.data?.formatted
  )

  const query = useQuery(
    ["USE_NET_VALUE", config.cellar.address],
    async () => {
      console.log(config.cellar.key, "run")
      if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR) {
        return await getNetValue_AAVE_V2_STABLE_CELLAR({
          activeAsset,
          cellarContract,
          lpToken: lpToken.data?.formatted,
          userStakes: userStakes,
        })
      }
      if (config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) {
        if (!address) {
          throw new Error("address is undefined")
        }
        return await getNetValue_CLEAR_GATE_CELLAR({
          cellarContract,
          address,
          activeAsset,
        })
      }
      if (config.cellar.key === CellarKey.PATACHE_LINK) {
        return await getNetValue_PATACHE_LINK({
          activeAsset,
          cellarContract,
          lpToken: lpToken.data?.formatted,
          userStakes: userStakes,
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled:
        AAVE_V2_STABLE_CELLAR_QUERY_ENABLED ||
        CLEAR_GATE_CELLAR_QUERY_ENABLED ||
        PATACHE_LINK_CELLAR_QUERY_ENABLED,
    }
  )

  return query
}

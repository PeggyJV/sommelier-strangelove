import { useQuery } from "@tanstack/react-query"
import { useCreateContracts } from "./useCreateContracts"
import { useAccount, useToken } from "wagmi"
import { useActiveAsset } from "./useActiveAsset"
import { useUserBalances } from "./useUserBalances"
import { useUserStakes } from "./useUserStakes"
import { ConfigProps, StakerKey } from "data/types"
import { getNetValueWithoutStaking } from "data/actions/common/getNetValueWithoutStaking"
import { getNetValueWithStaking } from "data/actions/common/getNetValueWithStaking"

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

  const cellarWithStakingV0815QueryEnabled = Boolean(
    config.staker?.key === StakerKey.CELLAR_STAKING_V0815 &&
      cellarContract.provider &&
      userStakes &&
      activeAsset &&
      lpToken.data?.formatted
  )

  const cellarWithoutStakingQueryEnabled = Boolean(
    !config.staker?.key && activeAsset && address
  )

  const query = useQuery(
    ["USE_NET_VALUE", config.cellar.address],
    async () => {
      if (config.staker?.key === StakerKey.CELLAR_STAKING_V0815) {
        return await getNetValueWithStaking({
          activeAsset,
          cellarContract,
          lpToken: lpToken.data?.formatted,
          userStakes: userStakes,
        })
      }
      if (!config.staker?.key) {
        if (!address) {
          throw new Error("address is undefined")
        }
        return await getNetValueWithoutStaking({
          cellarContract,
          address,
          activeAsset,
        })
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled:
        cellarWithStakingV0815QueryEnabled ||
        cellarWithoutStakingQueryEnabled,
    }
  )

  return query
}

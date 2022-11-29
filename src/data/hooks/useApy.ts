import { useQuery } from "@tanstack/react-query"
import { getApy as getApy_AAVE_V2_STABLE_CELLAR } from "data/actions/CELLAR_V0815/getApy"
import { getRewardsApy as v0815_getRewardsApy } from "data/actions/CELLAR_V0815/getRewardsApy"
import { CellarNameKey, ConfigProps } from "data/types"
import { CellarStakingV0815, CellarV0815 } from "src/abi/types"
import { useCreateContracts } from "./useCreateContracts"
import { useSommelierPrice } from "./useSommelierPrice"

export const useApy = (config: ConfigProps) => {
  const { cellarContract, stakerContract } =
    useCreateContracts(config)

  const sommPrice = useSommelierPrice()

  const v0815GetApy = [CellarNameKey.AAVE]
  const v0815ApyEnabled = v0815GetApy.includes(config.cellarNameKey)
  const v0815ApyQueryEnabled = Boolean(
    v0815ApyEnabled &&
      cellarContract.provider &&
      stakerContract?.provider
  )

  const v0815GetRewardApy = [
    CellarNameKey.ETH_BTC_MOM,
    CellarNameKey.ETH_BTC_TREND,
    CellarNameKey.STEADY_BTC,
    CellarNameKey.STEADY_ETH,
  ]
  const v0815RewardApyEnabled = v0815GetRewardApy.includes(
    config.cellarNameKey
  )
  const v0815RewardApyQueryEnabled = Boolean(
    v0815RewardApyEnabled && stakerContract?.provider
  )

  const queryEnabled =
    v0815ApyQueryEnabled || v0815RewardApyQueryEnabled

  const query = useQuery(
    ["USE_APY", sommPrice.data, config.cellar.address],
    async () => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }

      if (v0815ApyEnabled) {
        return await getApy_AAVE_V2_STABLE_CELLAR(
          cellarContract as CellarV0815,
          stakerContract as CellarStakingV0815,
          sommPrice.data
        )
      } else if (v0815RewardApyQueryEnabled) {
        return await v0815_getRewardsApy(
          stakerContract as CellarStakingV0815,
          sommPrice.data
        )
      }

      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled && Boolean(sommPrice.data),
    }
  )

  return {
    ...query,
    isLoading: sommPrice.isLoading || query.isLoading,
    isFetching: sommPrice.isFetching || query.isFetching,
    isRefetching: sommPrice.isRefetching || query.isRefetching,
    isError: sommPrice.isError || query.isError,
    error: sommPrice.error || query.error,
  }
}

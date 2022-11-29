import { useQuery } from "@tanstack/react-query"
import { getApy as getApy_AAVE_V2_STABLE_CELLAR } from "data/actions/CELLAR_V0815/getApy"
import { getRewardsApy as v0815_getRewardsApy } from "data/actions/CELLAR_V0815/getRewardsApy"
import { CellarNameKey, ConfigProps } from "data/types"
import { useGet10DaysShareValueQuery } from "generated/subgraph"
import { CellarV0815, CellarStakingV0815 } from "src/abi/types"
import { getPrevious10Days } from "utils/calculateTime"
import { useCreateContracts } from "./useCreateContracts"
import { useSommelierPrice } from "./useSommelierPrice"

const previous10Days = getPrevious10Days()

export const useApy = (config: ConfigProps) => {
  const { cellarContract, stakerContract } =
    useCreateContracts(config)

  const sommPrice = useSommelierPrice()

  const [{ fetching, data, error }, reexecute10Days] =
    useGet10DaysShareValueQuery({
      variables: {
        epoch: previous10Days,
        cellarAddress: config.id,
      },
    })

  const latestData = data?.cellar?.dayDatas.at(-1)
  const prevDayLatestData = data?.cellar?.dayDatas.at(-2)

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
    v0815RewardApyEnabled &&
      latestData?.shareValue &&
      prevDayLatestData?.shareValue &&
      stakerContract?.provider
  )

  const queryEnabled =
    v0815ApyQueryEnabled || v0815RewardApyQueryEnabled

  const query = useQuery(
    ["USE_APY", config.cellar.address],
    async () => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }

      if (v0815ApyEnabled) {
        return await getApy_AAVE_V2_STABLE_CELLAR(
          cellarContract as CellarV0815,
          stakerContract as CellarStakingV0815,
          sommPrice.data,
          latestData?.shareValue!,
          prevDayLatestData?.shareValue!
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
    isLoading: fetching || query.isLoading,
    error: error || query.error,
    isError: !!error || query.isError,
    isFetching: fetching || query.isFetching,
    refetch: () => {
      reexecute10Days
      query.refetch()
    },
  }
}

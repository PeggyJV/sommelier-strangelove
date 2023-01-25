import { useQuery } from "@tanstack/react-query"
import { getApy as getApy_AAVE_V2_STABLE_CELLAR } from "data/actions/CELLAR_V0815/getApy"
import { getRewardsApy } from "data/actions/CELLAR_V0815/getRewardsApy"
import { CellarNameKey, ConfigProps } from "data/types"
import { useGet10DaysShareValueQuery } from "generated/subgraph"
import { CellarV0815, CellarStakingV0815 } from "src/abi/types"
import { getPrevious10Days } from "utils/calculateTime"
import { useCreateContracts } from "./useCreateContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"

const previous10Days = getPrevious10Days()

export const useApy = (config: ConfigProps) => {
  const { cellarContract, stakerContract } =
    useCreateContracts(config)

  const sommPrice = useCoinGeckoPrice("sommelier")

  const [{ fetching, data, error }, reexecute10Days] =
    useGet10DaysShareValueQuery({
      variables: {
        epoch: previous10Days,
        cellarAddress: config.id,
      },
    })

  const dayDatas = data?.cellar?.dayDatas

  const aaveQueryEnabled = Boolean(
    config.cellarNameKey === CellarNameKey.AAVE &&
      dayDatas &&
      cellarContract.provider &&
      stakerContract?.provider
  )

  const getRewardsApyCellars = [
    CellarNameKey.ETH_BTC_MOM,
    CellarNameKey.ETH_BTC_TREND,
    CellarNameKey.STEADY_BTC,
    CellarNameKey.STEADY_ETH,
    CellarNameKey.STEADY_UNI,
    CellarNameKey.STEADY_MATIC,
    CellarNameKey.REAL_YIELD_USD,
  ]
  const getRewardsApyEnabled = getRewardsApyCellars.includes(
    config.cellarNameKey
  )
  const getRewardsApyQueryEnabled = Boolean(
    getRewardsApyEnabled && stakerContract?.provider
  )

  const queryEnabled = aaveQueryEnabled || getRewardsApyQueryEnabled

  const query = useQuery(
    ["USE_APY", config.cellar.address],
    async () => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }

      if (config.cellarNameKey === CellarNameKey.AAVE) {
        return await getApy_AAVE_V2_STABLE_CELLAR(
          cellarContract as CellarV0815,
          stakerContract as CellarStakingV0815,
          sommPrice.data,
          dayDatas!
        )
      }
      if (getRewardsApyEnabled) {
        return await getRewardsApy(
          stakerContract as CellarStakingV0815,
          sommPrice.data,
          4.4
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
    isLoading: fetching || query.isLoading || sommPrice.isLoading,
    error: error || query.error || sommPrice.error,
    isError: !!error || query.isError || sommPrice.isError,
    isFetching: fetching || query.isFetching || sommPrice.isFetching,
    refetch: () => {
      reexecute10Days()
      query.refetch()
    },
  }
}

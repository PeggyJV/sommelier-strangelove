import { useQuery } from "@tanstack/react-query"
import { getApy } from "data/actions/CELLAR_V0815/getApy"
import { CellarNameKey, CellarDataMap } from "data/types"
import { useGet10DaysShareValueQuery } from "generated/subgraph"
import { CellarStakingV0815 } from "src/abi/types"
import { getPrevious10Days } from "utils/calculateTime"
import { useCreateContracts } from "./useCreateContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { subDays } from "date-fns"

const previous10Days = getPrevious10Days()

export const useApy = (dataMap: CellarDataMap[string]) => {
  const { config, launchDate } = dataMap
  const { stakerContract } = useCreateContracts(config)

  const launchDay = launchDate ?? subDays(new Date(), 8)
  const launchEpoch = Math.floor(launchDay.getTime() / 1000)

  const sommPrice = useCoinGeckoPrice("sommelier")

  const [{ fetching, data, error }, reexecute10Days] =
    useGet10DaysShareValueQuery({
      variables: {
        epoch: previous10Days,
        cellarAddress: config.id,
      },
    })

  const dayDatas = data?.cellar?.dayDatas

  const yieldStrategiesEnabled = Boolean(
    config.cellarNameKey === CellarNameKey.AAVE &&
      dayDatas &&
      stakerContract?.provider
  )

  const withoutSubgraphDataStrategies = [
    CellarNameKey.ETH_BTC_MOM,
    CellarNameKey.ETH_BTC_TREND,
    CellarNameKey.STEADY_BTC,
    CellarNameKey.STEADY_ETH,
    CellarNameKey.STEADY_UNI,
    CellarNameKey.STEADY_MATIC,
    // Move to yield strategies after subgraph is updated
    CellarNameKey.REAL_YIELD_USD,
  ]
  const getRewardsApyEnabled = withoutSubgraphDataStrategies.includes(
    config.cellarNameKey
  )
  const withoutSubgraphDataEnabled = Boolean(
    getRewardsApyEnabled && stakerContract?.provider
  )

  const queryEnabled =
    yieldStrategiesEnabled || withoutSubgraphDataEnabled

  const query = useQuery(
    ["USE_APY", config.cellar.address],
    async () => {
      if (!sommPrice.data) {
        throw new Error("Sommelier price is undefined")
      }

      return await getApy({
        stakerContract: stakerContract as CellarStakingV0815,
        sommPrice: sommPrice.data,
        dayDatas,
        baseApy: config.baseApy,
        // remove that this after we fix calculation for cellars v2
        hardcodedApy:
          config.cellarNameKey === CellarNameKey.REAL_YIELD_USD,
        launchEpoch,
      })
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

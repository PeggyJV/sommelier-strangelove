import { useQuery } from "@tanstack/react-query"
import { CellarKey, CellarNameKey, ConfigProps } from "data/types"
import { useGetHourlyShareValueQuery } from "generated/subgraph"
import { toInteger } from "lodash"
import { getPrevious24Hours } from "utils/calculateTime"
import { useCreateContracts } from "./useCreateContracts"

export const useDailyChange = (config: ConfigProps) => {
  const { cellarContract } = useCreateContracts(config)
  const [{ data: hourlyData }] = useGetHourlyShareValueQuery({
    variables: {
      epoch: getPrevious24Hours(),
      cellarAddress: config.id,
    },
  })

  const queryEnabled = Boolean(
    (config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
      config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
      config.cellarNameKey === CellarNameKey.STEADY_BTC ||
      config.cellarNameKey === CellarNameKey.STEADY_ETH ||
      config.cellarNameKey === CellarNameKey.STEADY_UNI ||
      config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_USD) &&
      cellarContract.provider &&
      hourlyData?.cellarHourDatas
  )

  const query = useQuery(
    [
      "USE_DAILY_CHANGE",
      config.cellar.address,
      hourlyData?.cellarHourDatas,
    ],
    async () => {
      if (config.cellar.key === CellarKey.CELLAR_V0816) {
        const percentage =
          hourlyData?.cellarHourDatas &&
          ((toInteger(
            hourlyData.cellarHourDatas[
              hourlyData.cellarHourDatas.length - 1
            ].shareValue
          ) -
            toInteger(hourlyData.cellarHourDatas[0].shareValue)) /
            toInteger(hourlyData.cellarHourDatas[0].shareValue)) *
            100
        return percentage
      }
      throw new Error("UNKNOWN CONTRACT")
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}

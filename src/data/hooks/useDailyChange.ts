import { useQuery } from "@tanstack/react-query"
import { CellarKey, ConfigProps } from "data/types"
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
    (config.cellar.key === CellarKey.PATACHE_LINK ||
      config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) &&
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
      if (
        config.cellar.key === CellarKey.PATACHE_LINK ||
        config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
      ) {
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

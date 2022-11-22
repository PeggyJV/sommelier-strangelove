import { useQuery } from "@tanstack/react-query"
import { ConfigProps } from "data/types"
import { useGetSingleCellarValueQuery } from "generated/subgraph"
import { getPreviousDay, getPreviousWeek } from "utils/calculateTime"
import { getGainPct } from "utils/getGainPct"
import { useBtcIntervalGain } from "./useBtcIntervalGain"
import { useEthIntervalGain } from "./useEthIntervalGain"

export const useIntervalGainPct = (config: ConfigProps) => {
  // Shift back coingecko by 1 day is intentional
  const ethIntervalGain = useEthIntervalGain(6)
  const btcIntervalGain = useBtcIntervalGain(6)

  const [todayData] = useGetSingleCellarValueQuery({
    variables: {
      cellarAddress: config.id,
      epoch: getPreviousDay(),
    },
  })

  const [previousWeekData] = useGetSingleCellarValueQuery({
    variables: {
      cellarAddress: config.id,
      epoch: getPreviousWeek(),
    },
  })

  const { data: dataToday } = todayData
  const { cellar: cellarToday } = dataToday || {}
  const { dayDatas: todayDatas } = cellarToday || {}

  const { data: dataPreviousWeek } = previousWeekData
  const { cellar: cellarPreviousWeek } = dataPreviousWeek || {}
  const { dayDatas: previousWeekDatas } = cellarPreviousWeek || {}

  const queryEnabled = Boolean(
    config.id &&
      todayDatas?.[0].shareValue &&
      previousWeekDatas?.[0].shareValue &&
      Boolean(ethIntervalGain.data) &&
      Boolean(btcIntervalGain.data)
  )

  const query = useQuery(
    [
      "USE_INTERVAL_GAIN_PCT",
      config.id,
      todayDatas?.[0].shareValue,
      previousWeekDatas?.[0].shareValue,
      ethIntervalGain.data,
      btcIntervalGain.data,
    ],
    async () => {
      if (
        !todayDatas ||
        !previousWeekDatas ||
        !ethIntervalGain.data ||
        !btcIntervalGain.data
      ) {
        throw new Error("DATA UNDEFINED")
      }
      const cellarIntervalGainPct = getGainPct(
        Number(todayDatas[0].shareValue),
        Number(previousWeekDatas[0].shareValue)
      )

      const result =
        cellarIntervalGainPct -
        (ethIntervalGain.data + btcIntervalGain.data) / 2

      return result
    },
    {
      enabled: queryEnabled,
    }
  )

  return query
}

import { useQuery } from "@tanstack/react-query"
import { ConfigProps } from "data/types"
import { useGetSingleCellarValueQuery } from "generated/subgraph"
import { getPreviousMonth, getToday } from "utils/calculateTime"
import { getGainPct } from "utils/getGainPct"
import { useBtcIntervalGain } from "./useBtcIntervalGain"
import { useEthIntervalGain } from "./useEthIntervalGain"

export const useIntervalGainPct = (config: ConfigProps) => {
  const ethIntervalGain = useEthIntervalGain(30)
  const btcIntervalGain = useBtcIntervalGain(30)

  const [todayData] = useGetSingleCellarValueQuery({
    variables: {
      cellarAddress: config.id,
      epoch: getToday(),
    },
  })

  const [previousMonthData] = useGetSingleCellarValueQuery({
    variables: {
      cellarAddress: config.id,
      epoch: getPreviousMonth(),
    },
  })

  const { data: dataToday } = todayData
  const { cellar: cellarToday } = dataToday || {}
  const { dayDatas: todayDatas } = cellarToday || {}

  const { data: dataPreviousMonth } = previousMonthData
  const { cellar: cellarPreviousMonth } = dataPreviousMonth || {}
  const { dayDatas: previousMonthDatas } = cellarPreviousMonth || {}

  const queryEnabled = Boolean(
    config.id &&
      todayDatas?.[0].shareValue &&
      previousMonthDatas?.[0].shareValue &&
      Boolean(ethIntervalGain.data) &&
      Boolean(btcIntervalGain.data)
  )

  const query = useQuery(
    [
      "USE_INTERVAL_GAIN_PCT",
      config.id,
      todayDatas?.[0].shareValue,
      previousMonthDatas?.[0].shareValue,
      ethIntervalGain.data,
      btcIntervalGain.data,
    ],
    async () => {
      if (
        !todayDatas ||
        !previousMonthDatas ||
        !ethIntervalGain.data ||
        !btcIntervalGain.data
      ) {
        throw new Error("DATA UNDEFINED")
      }
      const cellarIntervalGainPct = getGainPct(
        Number(todayDatas[0].shareValue),
        Number(previousMonthDatas[0].shareValue)
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

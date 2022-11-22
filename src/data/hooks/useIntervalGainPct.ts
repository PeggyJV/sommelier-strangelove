import { useQuery } from "@tanstack/react-query"
import { CellarKey, ConfigProps } from "data/types"
import { useGetSingleCellarValueQuery } from "generated/subgraph"
import { getPreviousDay, getPreviousWeek } from "utils/calculateTime"
import { getGainPct } from "utils/getGainPct"
import { useBtcIntervalGain } from "./useBtcIntervalGain"
import { useEthIntervalGain } from "./useEthIntervalGain"
import { useUsdcIntervalGain } from "./useUSDCIntervalGain"

export const useIntervalGainPct = (config: ConfigProps) => {
  // Shift back coingecko by 1 day is intentional
  const ethIntervalGain = useEthIntervalGain(6)
  const btcIntervalGain = useBtcIntervalGain(6)
  const usdcIntervalGain = useUsdcIntervalGain(6)

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

  const PATACHE_LINK_QUERY_ENABLED = Boolean(
    config.id &&
      todayDatas?.[0].shareValue &&
      previousWeekDatas?.[0].shareValue &&
      Boolean(ethIntervalGain.data) &&
      Boolean(usdcIntervalGain.data)
  )

  const CLEAR_GATE_CELLAR_QUERY_ENABLED = Boolean(
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
      if (config.cellar.key === CellarKey.CLEAR_GATE_CELLAR) {
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
      }
      if (config.cellar.key === CellarKey.PATACHE_LINK) {
        if (
          !todayDatas ||
          !previousWeekDatas ||
          !usdcIntervalGain.data
        ) {
          throw new Error("DATA UNDEFINED")
        }
        const cellarIntervalGainPct = getGainPct(
          Number(todayDatas[0].shareValue),
          Number(previousWeekDatas[0].shareValue)
        )

        const result =
          cellarIntervalGainPct - usdcIntervalGain.data / 2

        return result
      }
    },
    {
      enabled:
        CLEAR_GATE_CELLAR_QUERY_ENABLED || PATACHE_LINK_QUERY_ENABLED,
    }
  )

  return query
}

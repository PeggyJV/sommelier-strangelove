import { useQuery } from "@tanstack/react-query"
import { CellarNameKey, ConfigProps } from "data/types"
import { useGetSingleCellarValueQuery } from "generated/subgraph"
import { getPreviousDay, getPreviousWeek } from "utils/calculateTime"
import { getGainPct } from "utils/getGainPct"
import { useAssetIntervalGain } from "./useAssetIntervalGain"

interface useIntervalGainProps {
  config: ConfigProps
  timeline?: "weekly" | "monthly"
}

export const useIntervalGain = ({
  config,
  timeline = "weekly",
}: useIntervalGainProps) => {
  const days = timeline === "weekly" ? 6 : 29
  const clearGate =
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND

  const patache =
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH

  const ethIntervalGain = useAssetIntervalGain(
    "weth",
    clearGate,
    days
  )
  const btcIntervalGain = useAssetIntervalGain(
    "wrapped-bitcoin",
    clearGate,
    days
  )
  const usdcIntervalGain = useAssetIntervalGain(
    "usd-coin",
    patache,
    days
  )

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
    patache &&
      config.id &&
      todayDatas?.[0].shareValue &&
      previousWeekDatas?.[0].shareValue &&
      Boolean(usdcIntervalGain.data)
  )

  const CLEAR_GATE_CELLAR_QUERY_ENABLED = Boolean(
    clearGate &&
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
    ],
    async () => {
      if (clearGate) {
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
      if (patache) {
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

        const result = cellarIntervalGainPct - usdcIntervalGain.data

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

import { useQuery } from "@tanstack/react-query"
import { CellarNameKey, ConfigProps } from "data/types"
import { useGetSingleCellarValueQuery } from "generated/subgraph"
import {
  getPreviousDay,
  getPreviousMonth,
  getPreviousWeek,
} from "utils/calculateTime"
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
  // DAYS AND DATE ARE SAME WITH THE CHART DATA
  const days = timeline === "weekly" ? 8 : 31
  // const clearGate =
  //   config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
  //   config.cellarNameKey === CellarNameKey.ETH_BTC_TREND

  const patache =
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  config.cellarNameKey === CellarNameKey.REAL_YIELD_USD

  const [todayData] = useGetSingleCellarValueQuery({
    variables: {
      cellarAddress: config.id,
      epoch: getPreviousDay(),
    },
  })

  const [previousData] = useGetSingleCellarValueQuery({
    variables: {
      cellarAddress: config.id,
      epoch:
        timeline === "weekly"
          ? getPreviousWeek()
          : getPreviousMonth(),
    },
  })

  const { data: dataToday } = todayData
  const { cellar: cellarToday } = dataToday || {}
  const { dayDatas: todayDatas } = cellarToday || {}

  const { data: dataPrevious } = previousData
  const { cellar: cellarPrevious } = dataPrevious || {}
  const { dayDatas: previousDatas } = cellarPrevious || {}

  // const ethIntervalGain = useAssetIntervalGain(
  //   "weth",
  //   clearGate,
  //   days,
  //   previousDatas && new Date(previousDatas[0].date * 1000),
  //   todayDatas && new Date(todayDatas[0].date * 1000)
  // )
  // const btcIntervalGain = useAssetIntervalGain(
  //   "wrapped-bitcoin",
  //   clearGate,
  //   days,
  //   previousDatas && new Date(previousDatas[0].date * 1000),
  //   todayDatas && new Date(todayDatas[0].date * 1000)
  // )
  const usdcIntervalGain = useAssetIntervalGain(
    "usd-coin",
    patache,
    days,
    previousDatas && new Date(previousDatas[0].date * 1000),
    todayDatas && new Date(todayDatas[0].date * 1000)
  )

  const PATACHE_LINK_QUERY_ENABLED = Boolean(
    patache &&
      config.id &&
      todayDatas?.[0].shareValue &&
      previousDatas?.[0].shareValue &&
      Boolean(usdcIntervalGain.data)
  )

  // const CLEAR_GATE_CELLAR_QUERY_ENABLED = Boolean(
  //   clearGate &&
  //     config.id &&
  //     todayDatas?.[0].shareValue &&
  //     previousDatas?.[0].shareValue &&
  //     Boolean(ethIntervalGain.data) &&
  //     Boolean(btcIntervalGain.data)
  // )

  const query = useQuery(
    [
      "USE_INTERVAL_GAIN_PCT",
      config.id,
      todayDatas?.[0].shareValue,
      previousDatas?.[0].shareValue,
    ],
    async () => {
      // if (clearGate) {
      //   if (
      //     !todayDatas ||
      //     !previousDatas ||
      //     !ethIntervalGain.data ||
      //     !btcIntervalGain.data
      //   ) {
      //     throw new Error("DATA UNDEFINED")
      //   }
      //   const cellarIntervalGainPct = getGainPct(
      //     Number(todayDatas[0].shareValue),
      //     Number(previousDatas[0].shareValue)
      //   )

      //   const result =
      //     cellarIntervalGainPct -
      //     (ethIntervalGain.data + btcIntervalGain.data) / 2

      //   return result
      // }
      if (patache) {
        if (!todayDatas || !previousDatas || !usdcIntervalGain.data) {
          throw new Error("DATA UNDEFINED")
        }
        const cellarIntervalGainPct = getGainPct(
          Number(Number(todayDatas[0].shareValue).toFixed(6)),
          Number(Number(previousDatas[0].shareValue).toFixed(6))
        )

        const result = cellarIntervalGainPct - usdcIntervalGain.data

        return result
      }
    },
    {
      enabled: PATACHE_LINK_QUERY_ENABLED,
    }
  )

  return query
}

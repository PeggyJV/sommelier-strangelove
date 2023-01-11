import { useQuery } from "@tanstack/react-query"
import {
  EthBtcGainChartData,
  getEthBtcGainChartData,
} from "data/actions/common/getEthBtcGainChartData"
import { useEffect } from "react"
import { useMarketChart } from "./useMarketChart"

export const useEthBtcGainChartData = ({
  day,
  interval,
  firstDate,
  enabled,
  onSuccess,
}: {
  day: number
  interval?: "hourly" | "daily"
  firstDate?: Date
  enabled?: boolean
  onSuccess?: (data: EthBtcGainChartData) => void
}) => {
  const wethMarketChart = useMarketChart({
    asset: "weth",
    day,
    interval,
    enabled,
  })
  const wbtcMarketChart = useMarketChart({
    asset: "wrapped-bitcoin",
    day,
    interval,
    enabled,
  })
  const query = useQuery(
    [
      "USE_ETH_BTC_GAIN_CHART_DATA",
      wethMarketChart.data,
      wbtcMarketChart.data,
      day,
      interval,
    ],
    async () => {
      if (!day) throw new Error("day is undefined")
      if (!wethMarketChart.data || !wbtcMarketChart.data) {
        throw new Error("market chart data is undefined")
      }
      return await getEthBtcGainChartData({
        day,
        interval: interval ?? "daily",
        firstDate,
        wethData: wethMarketChart.data,
        wbtcData: wbtcMarketChart.data,
      })
    },
    {
      enabled:
        Boolean(day) &&
        !!wethMarketChart.data &&
        !!wbtcMarketChart.data &&
        enabled,
      onSuccess: onSuccess,
    }
  )
  useEffect(() => {
    if (enabled && query.data) {
      onSuccess && onSuccess(query.data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Boolean(query.isFetched), enabled])
  return query
}

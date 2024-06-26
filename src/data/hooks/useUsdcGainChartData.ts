import { useQuery } from "@tanstack/react-query"
import {
  getUsdcGainChartData,
  UsdcGainChartData,
} from "data/actions/common/getUsdcGainChartData"
import { useEffect } from "react"
import { useMarketChart } from "./useMarketChart"

export const useUsdcGainChartData = ({
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
  onSuccess?: (data: UsdcGainChartData) => void
}) => {
  const usdcMarketChart = useMarketChart({
    asset: "usd-coin",
    day,
    interval,
    enabled,
  })
  const query = useQuery({
    queryKey: ["USE_USDC_GAIN_CHART_DATA", usdcMarketChart.data, day, interval],
    queryFn: async () => {
      if (!day) throw new Error("day is undefined")
      if (!usdcMarketChart.data) {
        throw new Error("market chart data is undefined")
      }
      return await getUsdcGainChartData({
        day,
        interval: interval ?? "daily",
        firstDate,
        usdcData: usdcMarketChart.data,
      })
    },
    enabled: Boolean(day) && !!usdcMarketChart.data && enabled,
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

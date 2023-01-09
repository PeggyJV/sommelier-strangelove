import { useQuery } from "@tanstack/react-query"
import {
  getUsdcGainChartData,
  UsdcGainChartData,
} from "data/actions/common/getUsdcGainChartData"
import { useEffect } from "react"

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
  const query = useQuery(
    ["USE_USDC_GAIN_CHART_DATA", day, interval],
    async () => {
      if (!day) throw new Error("day is undefined")
      return await getUsdcGainChartData({
        day,
        interval: interval ?? "daily",
        firstDate,
      })
    },
    {
      enabled: Boolean(day) && enabled,
      onSuccess: onSuccess,
    }
  )
  useEffect(() => {
    if (enabled && query.data) {
      onSuccess && onSuccess(query.data)
    }
  }, [Boolean(query.isFetched), enabled])

  return query
}

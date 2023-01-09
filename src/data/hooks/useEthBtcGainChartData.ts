import { useQuery } from "@tanstack/react-query"
import {
  EthBtcGainChartData,
  getEthBtcGainChartData,
} from "data/actions/common/getEthBtcGainChartData"
import { useEffect } from "react"

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
  const query = useQuery(
    ["USE_ETH_BTC_GAIN_CHART_DATA", day, interval],
    async () => {
      if (!day) throw new Error("day is undefined")
      return await getEthBtcGainChartData({
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

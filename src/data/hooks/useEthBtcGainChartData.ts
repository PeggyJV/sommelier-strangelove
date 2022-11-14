import { useQuery } from "@tanstack/react-query"
import { getEthBtcGainChartData } from "data/actions/common/getEthBtcGainChartData"

export const useEthBtcGainChartData = (
  day?: number,
  interval: "daily" | "hourly" = "daily"
) => {
  const query = useQuery(
    ["USE_ETH_BTC_GAIN_CHART_DATA", day, interval],
    async () => {
      if (!day) throw new Error("day is undefined")
      return await getEthBtcGainChartData(day, interval)
    },
    {
      enabled: Boolean(day),
    }
  )

  return query
}

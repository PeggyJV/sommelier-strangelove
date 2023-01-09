import { useQuery } from "@tanstack/react-query"
import { fetchMarketChart } from "data/actions/common/fetchMarketChart"

export const useMarketChart = ({
  asset,
  day,
  interval,
}: {
  asset: string
  day: number
  interval?: "hourly" | "daily"
}) => {
  const query = useQuery(
    ["USE_MARKET_CHART", asset, day, interval],
    async () => {
      if (!interval) throw new Error("interval is undefined")
      return await fetchMarketChart(asset, day, interval)
    },
    {
      enabled: Boolean(interval),
    }
  )

  return query
}

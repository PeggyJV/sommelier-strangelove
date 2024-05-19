import { useQuery } from "@tanstack/react-query"
import { fetchMarketChart } from "data/actions/common/fetchMarketChart"

export const useMarketChart = ({
  asset,
  day,
  interval,
  enabled,
}: {
  asset: string
  day: number
  interval?: "hourly" | "daily"
  enabled?: boolean
}) => {
  const query = useQuery({
    queryKey: ["USE_MARKET_CHART", asset, day, interval],
    queryFn: async () => {
      if (!interval) throw new Error("interval is undefined")
      return await fetchMarketChart(asset, day, interval)
    },
    enabled: !!asset && !!day && !!interval && enabled,
  }
  )

  return query
}

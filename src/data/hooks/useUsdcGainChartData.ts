import { useQuery } from "@tanstack/react-query"
import { getUsdcGainChartData } from "data/actions/common/getUsdcGainChartData"

export const useUsdcGainChartData = ({
  day,
  interval,
  firstDate,
}: {
  day: number
  interval?: "hourly" | "daily"
  firstDate?: Date
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
      enabled: Boolean(day),
    }
  )

  return query
}

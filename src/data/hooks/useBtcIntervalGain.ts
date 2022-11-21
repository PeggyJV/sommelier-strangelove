import { useQuery } from "@tanstack/react-query"
import { getWeeklyAssetIntervalGain } from "data/actions/common/getWeeklyAssetIntervalGain"

export const useBtcIntervalGain = (day: number) => {
  const query = useQuery(
    ["USE_BTC_INTERVAL_GAIN", day],
    async () => {
      return await getWeeklyAssetIntervalGain("wrapped-bitcoin", day)
    },
    {
      enabled: true,
    }
  )

  return query
}

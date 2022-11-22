import { useQuery } from "@tanstack/react-query"
import { getWeeklyAssetIntervalGain } from "data/actions/common/getWeeklyAssetIntervalGain"

export const useUsdcIntervalGain = (day: number) => {
  const query = useQuery(
    ["USE_USDC_INTERVAL_GAIN", day],
    async () => {
      return await getWeeklyAssetIntervalGain("wrapped-usdc", day)
    },
    {
      enabled: true,
    }
  )

  return query
}

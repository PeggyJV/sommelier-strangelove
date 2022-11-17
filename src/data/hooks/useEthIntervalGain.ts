import { useQuery } from "@tanstack/react-query"
import { getWeeklyAssetIntervalGain } from "data/actions/common/getWeeklyAssetIntervalGain"

export const useEthIntervalGain = (day: number) => {
  const query = useQuery(
    ["USE_ETH_INTERVAL_GAIN", day],
    async () => {
      return await getWeeklyAssetIntervalGain("weth", day)
    },
    {
      enabled: true,
    }
  )

  return query
}

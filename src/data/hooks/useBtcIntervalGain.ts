import { useQuery } from "@tanstack/react-query"
import { getAssetIntervalGain } from "data/actions/common/getAssetIntervalGain"

export const useBtcIntervalGain = (day: number) => {
  const query = useQuery(
    ["USE_BTC_INTERVAL_GAIN", day],
    async () => {
      return await getAssetIntervalGain("wrapped-bitcoin", day)
    },
    {
      enabled: true,
    }
  )

  return query
}

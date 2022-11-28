import { useQuery } from "@tanstack/react-query"
import { getWeeklyAssetIntervalGain } from "data/actions/common/getWeeklyAssetIntervalGain"
import { KnownCoingeckoAssetId } from "data/actions/types"

export const useWeeklyAssetIntervalGain = (
  asset: KnownCoingeckoAssetId,
  enabled: boolean
) => {
  const query = useQuery(
    ["USE_WEEKLY_ASSET_INTERVAL_GAIN", asset],
    async () => {
      // Shift back coingecko by 1 day is intentional
      return await getWeeklyAssetIntervalGain(asset, 6)
    },
    {
      enabled,
    }
  )

  return query
}

import { useQuery } from "@tanstack/react-query"
import { getAssetIntervalGain } from "data/actions/common/getAssetIntervalGain"
import { KnownCoingeckoAssetId } from "data/actions/types"

export const useAssetIntervalGain = (
  asset: KnownCoingeckoAssetId,
  enabled: boolean,
  days: number
) => {
  const query = useQuery(
    ["USE_WEEKLY_ASSET_INTERVAL_GAIN", asset],
    async () => {
      // Shift back coingecko by 1 day is intentional
      return await getAssetIntervalGain(asset, days)
    },
    {
      enabled,
    }
  )

  return query
}

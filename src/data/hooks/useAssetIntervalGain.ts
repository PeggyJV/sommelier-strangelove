import { useQuery } from "@tanstack/react-query"
import { getAssetIntervalGain } from "data/actions/common/getAssetIntervalGain"
import { KnownCoingeckoAssetId } from "data/actions/types"
import { useMarketChart } from "./useMarketChart"

export const useAssetIntervalGain = (
  asset: KnownCoingeckoAssetId,
  enabled: boolean,
  days: number
) => {
  const assetMarketChart = useMarketChart({
    asset,
    day: days,
    interval: "daily",
    enabled,
  })
  const query = useQuery(
    ["USE_WEEKLY_ASSET_INTERVAL_GAIN", asset, days, "daily"],
    async () => {
      // Shift back coingecko by 1 day is intentional
      if (!assetMarketChart.data) {
        throw new Error("Market chart is not defined")
      }
      return await getAssetIntervalGain(days, assetMarketChart.data)
    },
    {
      enabled: enabled && !!assetMarketChart.data,
    }
  )

  return query
}

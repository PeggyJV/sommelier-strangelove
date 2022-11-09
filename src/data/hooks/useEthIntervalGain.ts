import { useQuery } from "@tanstack/react-query"
import { getAssetIntervalGain } from "data/actions/common/getAssetIntervalGain"

export const useEthIntervalGain = (day: number) => {
  const query = useQuery(
    ["USE_ETH_INTERVAL_GAIN", day],
    async () => {
      return await getAssetIntervalGain("weth", day)
    },
    {
      enabled: true,
    }
  )

  return query
}

import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

export const getAssetIntervalGain = async (
  asset: "wrapped-bitcoin" | "weth",
  day: number
) => {
  try {
    const data = await fetchMarketChart(asset, day, "daily")
    const firstData = data.prices[0][1]
    const getToday = data.prices[data.prices.length - 1][1]

    const result = getGainPct(getToday, firstData)

    return result
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}

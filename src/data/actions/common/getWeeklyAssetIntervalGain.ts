import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

// shift back coin gecko data is intentional
export const getWeeklyAssetIntervalGain = async (
  asset: "wrapped-bitcoin" | "weth",
  day: number
) => {
  try {
    const data = await fetchMarketChart(asset, day, "daily")

    const previousWeek = data.prices[0]
    // coingecko returns the latest date with 2 hour value, 00:00 data and latest hour data. We get the 00:00 value with length - 2 index
    const todayData = data.prices.at(-2)
    if (!todayData) throw new Error("todayData undefined")
    const result = getGainPct(todayData![1], previousWeek[1])

    return result
  } catch (error) {
    console.warn(error)
    throw error
  }
}

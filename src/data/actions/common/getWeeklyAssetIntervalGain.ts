import { addWeeks, subDays } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

// shift back coin gecko data is intentional
export const getWeeklyAssetIntervalGain = async (
  asset: "wrapped-bitcoin" | "weth",
  day: number
) => {
  try {
    const data = await fetchMarketChart(asset, 6, "daily")

    const previousWeek = data.prices[0]
    // today
    const today = subDays(addWeeks(new Date(previousWeek[0]), 1), 1)
    const todayData = data.prices.at(-2)
    if (!todayData) throw new Error("todayData undefined")
    const result = getGainPct(todayData![1], previousWeek[1])

    return result
  } catch (error) {
    console.warn(error)
    throw error
  }
}

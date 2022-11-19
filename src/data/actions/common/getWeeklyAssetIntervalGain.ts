import { addWeeks, isSameDay } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

export const getWeeklyAssetIntervalGain = async (
  asset: "wrapped-bitcoin" | "weth",
  day: number
) => {
  try {
    const data = await fetchMarketChart(asset, day, "daily")
    const firstData = data.prices[0]
    // today
    const nextWeekDate = addWeeks(new Date(firstData[0]), 1)
    const nextWeekData = data.prices.find(([date]) => {
      return isSameDay(new Date(date), nextWeekDate)
    })

    if (!nextWeekData) throw new Error("nextWeekData undefined")
    const result = getGainPct(nextWeekData![1], firstData[1])

    return result
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}

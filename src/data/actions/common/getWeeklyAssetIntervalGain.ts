import { addWeeks, isSameDay, subDays } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

// shift back coin gecko data is intentional
export const getWeeklyAssetIntervalGain = async (
  asset: "wrapped-bitcoin" | "weth" | "wrapped-usdc",
  day: number
) => {
  try {
    const data = await fetchMarketChart(asset, day, "daily")

    const previousWeek = data.prices[0]
    // today
    const today = new Date(Date.now())
    const todayData = data.prices.find(([date]) => {
      return isSameDay(new Date(date), today)
    })

    if (!todayData) throw new Error("nextWeekData undefined")
    const result = getGainPct(todayData![1], previousWeek[1])

    return result
  } catch (error) {
    console.warn(error)
    throw error
  }
}

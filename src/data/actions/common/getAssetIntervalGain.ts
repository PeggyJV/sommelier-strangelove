import { isSameDay, subDays } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { MarketChartResponse } from "./fetchMarketChart"

// shift back coin gecko data is intentional
export const getAssetIntervalGain = async (
  day: number,
  marketChartData: MarketChartResponse,
  startDate: Date,
  endDate: Date
) => {
  try {
    const data = marketChartData
    const startData = data.prices.find((item) =>
      isSameDay(subDays(new Date(item[0]), 1), startDate)
    )
    const endData = data.prices.find((item) =>
      isSameDay(subDays(new Date(item[0]), 1), endDate)
    )
    // coingecko returns the latest date with 2 hour value, 00:00 data and latest hour data. We get the 00:00 value with length - 2 index

    if (!endData || !startData) throw new Error("data undefined")
    const result = getGainPct(endData[1], startData[1])

    return result
  } catch (error) {
    console.warn(error)
    throw error
  }
}

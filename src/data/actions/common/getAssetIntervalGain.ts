import { getGainPct } from "utils/getGainPct"

export const getAssetIntervalGain = async (
  asset: "wrapped-bitcoin" | "weth",
  day: number
) => {
  const url = `https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=usd&days=${day}&interval=daily`
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data = await response.json()
    const previousMonth = data.prices[0][1]
    const getToday = data.prices[data.prices.length - 1][1]

    const result = getGainPct(getToday, previousMonth)

    return result
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}

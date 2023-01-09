export interface MarketChartResponse {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export const fetchMarketChart = async (
  asset: string,
  day: number,
  interval: string
) => {
  const url = `https://api.coingecko.com/api/v3/coins/${asset}/market_chart?vs_currency=usd&days=${day}&interval=${interval}`
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const data: MarketChartResponse = await response.json()

    return data
  } catch (error) {
    console.warn(error)
    throw error
  }
}

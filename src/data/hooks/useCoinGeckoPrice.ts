import { useQuery } from "@tanstack/react-query"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { Token } from "src/data/tokenConfig"

// Fallback prices when CoinGecko API is rate-limited
const FALLBACK_PRICES: Record<string, string> = {
  sommelier: "0.0005", // SOMM fallback price in USD
}

export const useCoinGeckoPrice = (coin: Token) => {
  const query = useQuery({
    queryKey: ["USE_COIN_GECKO_PRICE", coin],
    queryFn: async () => {
      try {
        return await fetchCoingeckoPrice(coin, "usd")
      } catch (error) {
        // Return fallback price if available, otherwise re-throw
        const fallback = FALLBACK_PRICES[coin.coinGeckoId.toLowerCase()]
        if (fallback) {
          console.warn(
            `Using fallback price for ${coin.coinGeckoId}: ${fallback}`
          )
          return fallback
        }
        throw error
      }
    },
    retry: 2,
  })

  return query
}

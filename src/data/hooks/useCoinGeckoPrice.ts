import { useQuery } from "@tanstack/react-query"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"

export const useCoinGeckoPrice = (coin: string) => {
  const query = useQuery(["USE_COIN_GECKO_PRICE", coin], async () => {
    return await fetchCoingeckoPrice(coin, "usd")
  })

  return query
}

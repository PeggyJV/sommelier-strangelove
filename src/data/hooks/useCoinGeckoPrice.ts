import { useQuery } from "@tanstack/react-query"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { Token } from "src/data/tokenConfig"

export const useCoinGeckoPrice = (coin: Token) => {
  const query = useQuery(["USE_COIN_GECKO_PRICE", coin], {
    queryFn: async () => {
      return await fetchCoingeckoPrice(coin, "usd")
    },
    retry: true,
  })

  return query
}

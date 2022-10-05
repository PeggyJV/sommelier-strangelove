import { useQuery } from "@tanstack/react-query"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"

export const useSommelierPrice = () => {
  const query = useQuery(["USE_SOMMELIER_PRICE"], async () => {
    return await fetchCoingeckoPrice("sommelier", "usd")
  })

  return query
}

import { useEffect, useState } from "react"
import { useBlockNumber } from "@usedapp/core"

import { fetchCoingeckoPrice } from "queries/get-coingecko-price"

export const useCoingeckoPrice = (
  base: string,
  quote = "usd"
): string | undefined => {
  const [price, setPrice] = useState<string | undefined>(undefined)
  const blockNo = useBlockNumber()

  useEffect(() => {
    async function getPrice() {
      const tokenPrice = await fetchCoingeckoPrice(base, quote)
      setPrice(tokenPrice)
    }

    void getPrice()
  }, [base, quote, blockNo])

  return price
}

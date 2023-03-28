const getUrl = (baseId: string, quoteId: string) =>
  `/api/coingecko-simple-price?base=${baseId}&quote=${quoteId}`

export const fetchCoingeckoPrice = async (
  base: string,
  quote: string
) => {
  try {
    const baseId = base.toLowerCase()
    const quoteId = quote.toLowerCase()
    const url = getUrl(baseId, quoteId)
    const data = await fetch(url)
    const result = await data.json()

    return result.price ? result.price + "" : undefined
  } catch (_) {
    return undefined
  }
}

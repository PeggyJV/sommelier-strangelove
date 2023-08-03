const getUrl = (baseId: string, quoteId: string) =>
  `/api/coingecko-simple-price?base=${baseId}&quote=${quoteId}`

export const fetchCoingeckoPrice = async (
  base: string,
  quote: string
) => {
  const baseId = base.toLowerCase()
  const quoteId = quote.toLowerCase()
  const url = getUrl(baseId, quoteId)

  try {
    const data = await fetch(url)
    const result = await data.json()

    return result.price ? result.price + "" : undefined
  } catch (error) {
    console.log("Error fetching Coingecko Price", error)
    throw Error(error as string)
  }
}

import { NextApiRequest, NextApiResponse } from "next"

const coinGeckoAPIKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
const COINGECKO_URL = coinGeckoAPIKey
  ? "https://pro-api.coingecko.com/api/v3/simple/price"
  : "https://api.coingecko.com/api/v3/simple/price"

const getCoingeckoSimplePriceUri = (
  baseId: string,
  quoteId: string
) => `${COINGECKO_URL}/?ids=${baseId}&vs_currencies=${quoteId}`

const coinGeckoSimplePrice = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { base, quote } = req.query
    const coinGeckoAPIKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
    const baseId = base as string
    const quoteId = quote as string
    const url = getCoingeckoSimplePriceUri(baseId, quoteId)
    const data = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(coinGeckoAPIKey && {
          "x-cg-pro-api-key": coinGeckoAPIKey,
        }),
      },
    })
    const result = await data.json()
    const price = result[baseId][quoteId]
    res.status(200).json({
      price,
    })
  } catch (error) {
    res.status(500).send({ error: "failed to fetch data" })
  }
}

export default coinGeckoSimplePrice

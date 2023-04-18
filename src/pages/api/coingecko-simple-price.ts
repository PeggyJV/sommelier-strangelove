import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

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
    if (!baseId || !quoteId) {
      res.status(400).send({
        error: "missing base or quote",
        message: "missing base or quote",
      })
      return
    }
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
    if (data.status !== 200) {
      throw new Error("failed to fetch data")
    }
    const result = await data.json()

    const price = result[baseId][quoteId]
    res.setHeader(
      "Cache-Control",
      "public, max-age=10, s-maxage=30, stale-while-revalidate=59"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      price,
    })
  } catch (error) {
    res
      .status(500)
      .send({ error: "failed to fetch data", message: error })
  }
}

export default coinGeckoSimplePrice

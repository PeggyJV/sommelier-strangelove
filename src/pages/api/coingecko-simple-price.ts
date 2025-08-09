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
    // Handle non-200 without throwing to avoid breaking UI
    if (data.status !== 200) {
      console.warn(
        "coingecko-simple-price non-200",
        data.status,
        baseId,
        quoteId
      )
      res.setHeader(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      res.setHeader("Access-Control-Allow-Origin", baseUrl)
      res.status(200).json({ price: null })
      return
    }
    const result = await data.json()

    const price = result?.[baseId]?.[quoteId] ?? null

    // Guard missing tokens
    if (price === null || price === undefined) {
      console.warn(
        "coingecko-simple-price missing price",
        JSON.stringify(result).slice(0, 120) + "...",
        baseId,
        quoteId
      )
      res.setHeader(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      res.setHeader("Access-Control-Allow-Origin", baseUrl)
      res.status(200).json({ price: null })
      return
    }
    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      price,
    })
  } catch (error) {
    console.error(error)
    // For resilience, return a 200 with null price to avoid client errors
    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).send({ price: null })
  }
}

export default coinGeckoSimplePrice

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
  const { base, quote } = req.query
  const baseId = base as string
  const quoteId = quote as string

  if (!baseId || !quoteId) {
    res.status(400).send({
      error: "missing base or quote",
      message: "missing base or quote",
    })
    return
  }

  try {
    const coinGeckoAPIKey = process.env.NEXT_PUBLIC_COINGECKO_API_KEY
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
    // Safe JSON parse and lookups
    const result = await data.json().catch(() => null as any)
    const baseObj = result?.[baseId]
    const price =
      baseObj && typeof baseObj === "object" ? baseObj?.[quoteId] : undefined

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)

    if (price === undefined) {
      return res.status(200).json({
        price: null,
        baseId,
        quoteId,
        source: "coingecko",
        note: "not_found_or_rate_limited",
      })
    }

    return res.status(200).json({ price })
  } catch (error) {
    // Never 500 for CG hiccups: return a safe payload
    console.error(error)
    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    return res.status(200).json({
      price: null,
      baseId,
      quoteId,
      source: "coingecko",
      note: "request_failed",
    })
  }
}

export default coinGeckoSimplePrice

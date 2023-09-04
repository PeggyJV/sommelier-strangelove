import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT ?? ""

const graphIndividualStratData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    const { cellarAddress } = req.query

    const query = `
    query GetStrategyData($cellarAddress: ID!) {
      cellar(id: $cellarAddress) {
        id
        dayDatas(orderBy: date, orderDirection: desc) {
          date
          shareValue
        }
        tvlTotal
        asset {
          id
          symbol
          decimals
        }
        positions
        shareValue
      }
    }
    `

    const data = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { cellarAddress },
      }),
    })

    if (data.status !== 200) {
      throw new Error("failed to fetch data")
    }
    const result = await data.json()

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      result,
    })
  } catch (error) {
    res
      .status(500)
      .send({ error: "failed to fetch data", message: error })
  }
}

export default graphIndividualStratData

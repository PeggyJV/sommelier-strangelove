import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT ?? ""

const graphWeeklyShareValueData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { epoch, cellarAddress } = req.query
    // Cast epoch to number
    const epochNumber = Number(epoch)

    const query = `
    query GetWeeklyTVLByAdress($epoch: Int!, $cellarAddress: ID!) {
      cellar(id: $cellarAddress) {
        dayDatas(
          first: 7
          orderDirection: asc
          orderBy: date
          where: {date_gte: $epoch}
        ) {
          date
          tvlTotal
        }
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
        variables: { epoch: epochNumber, cellarAddress },
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

export default graphWeeklyShareValueData

import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const GRAPH_URL = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT ?? ""

const graphCellarStratgyData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    // TODO: Change this to hourly data for round 3 to test out. Should be ok?
    const query = `
      query GetAllStrategiesData($monthAgoEpoch: Int!) {
        cellars {
          id
          dayDatas: dayDatas(
            orderBy: date
            orderDirection: desc
            where: { date_gte: $monthAgoEpoch } ) {
            date
            shareValue
          }
          tvlTotal
          shareValue
        }
      }
    `

    // Make monthAgoEpoch nearest full day 30 days ago
    const now = new Date()
    const monthAgoDate = new Date()

    monthAgoDate.setDate(now.getDate() - 30)
    monthAgoDate.setHours(0, 0, 0, 0) // Set the time to the start of the day

    const monthAgoEpoch = Math.floor(monthAgoDate.getTime() / 1000)

    const data = await fetch(GRAPH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { monthAgoEpoch },
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

export default graphCellarStratgyData

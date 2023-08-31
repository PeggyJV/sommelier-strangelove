import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const sommelierAPIWeeklyShareValueData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { epoch, cellarAddress } = req.query
    // Cast epoch to number
    const startEpochNumber = Number(epoch)

    // TODO: Generalize for multichain
    const data = await fetch(
      `https://api.sommelier.finance/dailyData/ethereum/${cellarAddress}/${startEpochNumber}/latest`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (data.status !== 200) {
      throw new Error("failed to fetch data")
    }
    const result = await data.json()

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)

    // Format similar to subgraph queries so as to not rewrite large swaths of code

    res.status(200).json({
      result,
    })
  } catch (error) {
    res
      .status(500)
      .send({ error: "failed to fetch data", message: error })
  }
}

export default sommelierAPIWeeklyShareValueData

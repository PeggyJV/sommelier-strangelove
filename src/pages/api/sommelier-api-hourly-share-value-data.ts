import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const sommelierAPIHourlyShareValueData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { epoch, cellarAddress } = req.query
    // Cast epoch to number
    const startEpochNumber = Number(epoch)

    // TODO: Generalize for multichain
    const data = await fetch(
      `https://api.sommelier.finance/hourlyData/ethereum/${cellarAddress}/${startEpochNumber}/latest`,
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

    const fetchedData = await data.json()

    let transformedData = fetchedData.Response.map(
      (cellarHourData: any) => ({
        date: cellarHourData.unix_seconds,
        // Multiply by 1e18 and drop any decimals
        shareValue: Math.floor(
          cellarHourData.share_price * 1e18
        ).toString(),
      })
    )

    // Order by descending date
    transformedData.sort((a: any, b: any) => b.date - a.date)
    // Trim off to only be the most recent 7 days
    transformedData = transformedData.splice(0, 7)

    const formattedResult = {
      result: {
        data: {
          cellarHourDatas: transformedData,
        },
      },
    }

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)

    // Format similar to subgraph queries so as to not rewrite large swaths of code
    res.status(200).json(formattedResult)
  } catch (error) {
    res
      .status(500)
      .send({ error: "failed to fetch data", message: error })
  }
}

export default sommelierAPIHourlyShareValueData

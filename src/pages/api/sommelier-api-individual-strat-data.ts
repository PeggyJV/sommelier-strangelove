import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const sommelierAPIIndividualStratData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { cellarAddress } = req.query

    // TODO: Generalize for multichain
    const data = await fetch(
      `https://api.sommelier.finance/dailyData/ethereum/${cellarAddress}/0/latest`,
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
      (dayData: any) => ({
        date: dayData.unix_seconds,
        // Multiply by 1e18 and drop any decimals
        shareValue: Math.floor(dayData.share_price * 1e18).toString(),
      })
    )

    // Order by descending date
    transformedData.sort((a: any, b: any) => b.date - a.date)

    // Most recent
    const baseAssetTvl = BigInt(
      Math.floor(Number(fetchedData.Response[0].total_assets) * 1e18) //FE expects everything to be 18 digits regardless of asset
    )













    
    // TODO: Get shareValue and TvlTotal from latest hourly data async
    const formattedResult = {
      result: {
        data: {
          cellar: {
            id: cellarAddress,
            tvlTotal: String(baseAssetTvl),
            shareValue: transformedData[0].shareValue, // Most recent
            dayDatas: transformedData,
          },
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

export default sommelierAPIIndividualStratData

import { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const sommelierAPIAllTimeShareValueData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { cellarAddress, chain } = req.query

    const data = await fetch(
      `https://api.sommelier.finance/dailyData/${chain}/${cellarAddress}/0/latest`,
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
    let chainStr = ''
    if (chain !== "ethereum") {
      chainStr = "-" + chain
    }
    
    let cellarDecimals =
      CellaAddressDataMap[cellarAddress!.toString().toLowerCase() + chainStr]
        .config.cellar.decimals

    let transformedData = fetchedData.Response.map(
      (dayData: any) => ({
        date: dayData.unix_seconds,
        // Multiply by cellarDecimals and drop any decimals
        shareValue: Math.floor(
          dayData.share_price * 10 ** cellarDecimals
        ).toString(),
      })
    )

    // Order by descending date
    transformedData.sort((a: any, b: any) => b.date - a.date)

    const formattedResult = {
      result: {
        data: {
          cellar: {
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
    console.error(error)
    res
      .status(500)
      .send({
        error: "failed to fetch data",
        message:
          (error as Error).message || "An unknown error occurred",
      })
  }
}

export default sommelierAPIAllTimeShareValueData

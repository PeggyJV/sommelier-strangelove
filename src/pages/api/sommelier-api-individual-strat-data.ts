import { NextApiRequest, NextApiResponse } from "next"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

async function fetchData(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response.json()
}

const sommelierAPIIndividualStratData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    let { cellarAddress } = req.query

    const unix_timestamp_24_hours_ago =
      Math.floor(Date.now() / 1000) - 24 * 60 * 60

    const dailyDataUrl = `https://api.sommelier.finance/dailyData/ethereum/${cellarAddress}/0/latest`
    const hourlyDataUrl = `https://api.sommelier.finance/hourlyData/ethereum/${cellarAddress}/${unix_timestamp_24_hours_ago}/latest`

    const [dailyData, hourlyData] = await Promise.all([
      fetchData(dailyDataUrl),
      fetchData(hourlyDataUrl),
    ])

    let transformedDailyData = dailyData.Response.map(
      (dayData: any) => ({
        date: dayData.unix_seconds,
        // Multiply by 1e18 and drop any decimals
        shareValue: Math.floor(dayData.share_price * 1e18).toString(),
      })
    )    

    // Order by descending date
    transformedDailyData.sort((a: any, b: any) => b.date - a.date)

    // Do the same for hourly data
    let transformedHourlyData = hourlyData.Response.map(
      (hourData: any) => ({
        date: hourData.unix_seconds,
        // Multiply by 1e18 and drop any decimals
        shareValue: Math.floor(
          hourData.share_price * 1e18
        ).toString(),
        total_assets: hourData.total_assets,
      })
    )

    // Order by descending date
    transformedHourlyData.sort((a: any, b: any) => b.date - a.date)

    // Most recent hourly
    const baseAssetTvl = BigInt(
      Math.floor(Number(transformedHourlyData[0].total_assets) * 1e18) // FE expects everything to be 18 digits regardless of asset
    )

    // TODO: Get shareValue and TvlTotal from latest hourly data async
    const formattedResult = {
      result: {
        data: {
          cellar: {
            id: cellarAddress,
            tvlTotal: String(baseAssetTvl), // Most recent hourly
            shareValue: transformedHourlyData[0].shareValue, // Most recent hourly
            dayDatas: transformedDailyData,
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
        message: (error as Error).message || "An unknown error occurred",
      })
  }
}

export default sommelierAPIIndividualStratData

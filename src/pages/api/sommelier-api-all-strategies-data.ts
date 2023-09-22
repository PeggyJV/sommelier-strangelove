import { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/"

interface CellarType {
  id: string
  dayDatas: any // Replace 'any' with a more specific type if possible
  shareValue: any // Replace 'any' with a more specific type if possible
  tvlTotal: number
}

async function fetchData(url: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  return response
}

const sommelierAPIAllStrategiesData = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  try {
    // Make monthAgoEpoch nearest full day 30 days ago
    const now = new Date()
    const monthAgoDate = new Date()

    monthAgoDate.setDate(now.getDate() - 30)
    monthAgoDate.setHours(0, 0, 0, 0) // Set the time to the start of the day

    const monthAgoEpoch = Math.floor(monthAgoDate.getTime() / 1000)

    // TODO: Generalize for multichain
    let allStrategyData = `https://api.sommelier.finance/dailyData/ethereum/allCellars/${monthAgoEpoch}/latest`
    let tvlData = `https://api.sommelier.finance/tvl`

    const [allStrategyDataResponse, tvlDataResponse] =
      await Promise.all([
        fetchData(allStrategyData),
        fetchData(tvlData),
      ])

    if (
      allStrategyDataResponse.status !== 200 ||
      tvlDataResponse.status !== 200
    ) {
      throw new Error(
        "failed to fetch data: Strategy Response code: " +
          allStrategyDataResponse.status +
          " Tvl Response code:" +
          tvlDataResponse.status
      )
    }

    const fetchedData = await allStrategyDataResponse.json()

    let returnObj = {
      result: {
        data: {
          cellars: [] as CellarType[],
        },
      },
    }

    const fetchedTVL = await tvlDataResponse.json()

    // For each key perform transofrmation
    Object.keys(fetchedData.Response).forEach((cellarAddress) => {
      let cellarDecimals =
        CellaAddressDataMap[cellarAddress!.toString().toLowerCase()]
          .config.cellar.decimals

      let transformedData = fetchedData.Response[cellarAddress].map(
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
      
      // Get tvl
      let tvl = fetchedTVL.Response[cellarAddress]

      if (tvl === undefined) {
        tvl = 0
      }

      // Create a new response object with the transformed data
      let cellarObj = {
        id: cellarAddress.toLowerCase(),
        dayDatas: transformedData,
        shareValue: transformedData[0].shareValue,
        tvlTotal: tvl,
      }

      returnObj.result.data.cellars.push(cellarObj)
    })

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)

    // Format similar to subgraph queries so as to not rewrite large swaths of code
    res.status(200).json(returnObj)
  } catch (error) {
    console.error(error)
    res.status(500).send({
      error: "failed to fetch data",
      message:
        (error as Error).message || "An unknown error occurred",
    })
  }
}

export default sommelierAPIAllStrategiesData

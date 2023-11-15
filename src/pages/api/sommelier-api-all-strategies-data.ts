import { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

interface CellarType {
  id: string
  dayDatas: any
  shareValue: any
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

    //! Whenever theres a new chain supported this needs to be updated
    let allEthereumStrategyData = `https://api.sommelier.finance/dailyData/ethereum/allCellars/${monthAgoEpoch}/latest`
    let allArbitrumStrategyData = `https://api.sommelier.finance/dailyData/arbitrum/allCellars/${monthAgoEpoch}/latest`
    let tvlData = `https://api.sommelier.finance/tvl`

    const [
      allEthereumStrategyDataResponse,
      allArbitrumStrategyDataResponse,
      tvlDataResponse,
    ] = await Promise.all([
      fetchData(allEthereumStrategyData),
      fetchData(allArbitrumStrategyData),
      fetchData(tvlData),
    ])

    if (
      allEthereumStrategyDataResponse.status !== 200 ||
      allArbitrumStrategyDataResponse.status !== 200 ||
      tvlDataResponse.status !== 200
    ) {
      throw new Error(
        "failed to fetch data: ETH Strategy Response code: " +
          allEthereumStrategyDataResponse.status +
          " Arbitrum Strategy Response code: " +
          allArbitrumStrategyDataResponse.status +
          " Tvl Response code:" +
          tvlDataResponse.status
      )
    }

    const fetchedEthData =
      await allEthereumStrategyDataResponse.json()
    const fetchedArbitrumData =
      await allArbitrumStrategyDataResponse.json()

    let returnObj = {
      result: {
        data: {
          cellars: [] as CellarType[],
        },
      },
    }

    const fetchedTVL = await tvlDataResponse.json()

    // Do this loop per chain
    // For each key perform transformation

    // ! Eth transform
    Object.keys(fetchedEthData.Response).forEach((cellarAddress) => {
      // If the cellar address is not in the CellaAddressDataMap skip it
      if (
        CellaAddressDataMap[
          cellarAddress!.toString().toLowerCase()
        ] === undefined
      ) {
        console.warn(`${cellarAddress} not a valid cellar address`)
        return
      }

      let cellarDecimals =
        CellaAddressDataMap[cellarAddress!.toString().toLowerCase()]
          .config.cellar.decimals

      let transformedData = fetchedEthData.Response[
        cellarAddress
      ].map((dayData: any) => ({
        date: dayData.unix_seconds,
        // Multiply by cellarDecimals and drop any decimals
        shareValue: Math.floor(
          dayData.share_price * 10 ** cellarDecimals
        ).toString(),
      }))

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

    // ! Arbitrum transform
    Object.keys(fetchedArbitrumData.Response).forEach(
      (cellarAddress) => {
        // If the cellar address is not in the CellaAddressDataMap skip it
        if (
          CellaAddressDataMap[
            cellarAddress!.toString().toLowerCase() + "-arbitrum"
          ] === undefined
        ) {
          console.warn(`${cellarAddress} not a valid cellar address`)
          return
        }

        let cellarDecimals =
          CellaAddressDataMap[
            cellarAddress!.toString().toLowerCase() + "-arbitrum"
          ].config.cellar.decimals

        let transformedData = fetchedArbitrumData.Response[
          cellarAddress
        ].map((dayData: any) => ({
          date: dayData.unix_seconds,
          // Multiply by cellarDecimals and drop any decimals
          shareValue: Math.floor(
            dayData.share_price * 10 ** cellarDecimals
          ).toString(),
        }))

        // Order by descending date
        transformedData.sort((a: any, b: any) => b.date - a.date)

        // Get tvl
        let tvl = fetchedTVL.Response[cellarAddress + "-arbitrum"]

        if (tvl === undefined) {
          tvl = 0
        }

        // Create a new response object with the transformed data
        let cellarObj = {
          id: cellarAddress.toLowerCase() + "-arbitrum",
          dayDatas: transformedData,
          shareValue: transformedData[0].shareValue,
          tvlTotal: tvl,
        }

        returnObj.result.data.cellars.push(cellarObj)
      }
    )

    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)

    // Format similar to subgraph queries so as to not rewrite large swaths of code
    res.status(200).json(returnObj)
  } catch (error) {
    res.status(500).send({
      error: `could not fetch data`,
      message:
        (error as Error).message || "An unknown error occurred",
    })
  }
}

export default sommelierAPIAllStrategiesData

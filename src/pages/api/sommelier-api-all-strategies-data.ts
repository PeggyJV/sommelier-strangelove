import { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"
import { chainSlugMap } from "data/chainConfig"
import { DailyDataResponse } from "data/types"
import { getLatestTvlFromDaily } from "utils/dailyData"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

const DEBUG_FETCH = process.env.NEXT_PUBLIC_DEBUG_FETCH === "1"

interface CellarType {
  id: string
  dayDatas: any
  shareValue: any
  tvlTotal: number
  chain: string
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

    monthAgoDate.setDate(now.getDate() - 31)
    monthAgoDate.setHours(0, 0, 0, 0) // Set the time to the start of the day

    const monthAgoEpoch = Math.floor(monthAgoDate.getTime() / 1000)

    //! Whenever theres a new chain supported this needs to be updated
    let allEthereumStrategyData = `https://api.sommelier.finance/dailyData/ethereum/allCellars/${monthAgoEpoch}/latest`
    let allArbitrumStrategyData = `https://api.sommelier.finance/dailyData/arbitrum/allCellars/${monthAgoEpoch}/latest`
    let allOptimismStrategyData = `https://api.sommelier.finance/dailyData/optimism/allCellars/${monthAgoEpoch}/latest`

    const [
      allEthereumStrategyDataResponse,
      allArbitrumStrategyDataResponse,
      allOptimismStrategyDataResponse,
    ] = await Promise.all([
      fetchData(allEthereumStrategyData),
      fetchData(allArbitrumStrategyData),
      fetchData(allOptimismStrategyData),
    ])

    // Proceed even if one chain fails; use empty responses for non-200
    const okEth = allEthereumStrategyDataResponse.status === 200
    const okArb = allArbitrumStrategyDataResponse.status === 200
    const okOp = allOptimismStrategyDataResponse.status === 200

    const fetchedEthData: DailyDataResponse = okEth
      ? await allEthereumStrategyDataResponse.json()
      : { Response: {} }
    const fetchedArbitrumData: DailyDataResponse = okArb
      ? await allArbitrumStrategyDataResponse.json()
      : { Response: {} }
    const fetchedOptimismData: DailyDataResponse = okOp
      ? await allOptimismStrategyDataResponse.json()
      : { Response: {} }
    const fetchedScrollData = { Response: {} as any }

    let returnObj = {
      result: {
        data: {
          cellars: [] as CellarType[],
        },
      },
    }

    if (DEBUG_FETCH) {
      console.log("[all-strategies] fetch status", {
        eth: allEthereumStrategyDataResponse.status,
        arb: allArbitrumStrategyDataResponse.status,
        opt: allOptimismStrategyDataResponse.status,
        ethCount: Object.keys(fetchedEthData.Response || {}).length,
        arbCount: Object.keys(fetchedArbitrumData.Response || {})
          .length,
        optCount: Object.keys(fetchedOptimismData.Response || {})
          .length,
      })
    }

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

      // Get tvl from the freshest daily snapshot
      let tvl = getLatestTvlFromDaily(fetchedEthData, cellarAddress)

      let shareValue = 0
      if (transformedData.length === 0) {
        console.warn(`No data found for ${cellarAddress} on Ethereum`)
      } else {
        shareValue = transformedData[0].shareValue
      }

      // Create a new response object with the transformed data
      let cellarObj = {
        id: cellarAddress.toLowerCase(),
        dayDatas: transformedData,
        shareValue: shareValue,
        tvlTotal: tvl,
        chain: chainSlugMap.ETHEREUM.id,
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
        let tvl = getLatestTvlFromDaily(
          fetchedArbitrumData,
          cellarAddress
        )

        let shareValue = 0
        if (transformedData.length === 0) {
          console.warn(
            `No data found for ${cellarAddress} on Arbitrum`
          )
        } else {
          shareValue = transformedData[0].shareValue
        }

        // Create a new response object with the transformed data
        let cellarObj = {
          id: cellarAddress.toLowerCase() + "-arbitrum",
          dayDatas: transformedData,
          shareValue: shareValue,
          tvlTotal: tvl,
          chain: chainSlugMap.ARBITRUM.id,
        }

        returnObj.result.data.cellars.push(cellarObj)
      }
    )

    // ! Optimism transform
    Object.keys(fetchedOptimismData.Response).forEach(
      (cellarAddress) => {
        // If the cellar address is not in the CellaAddressDataMap skip it
        if (
          CellaAddressDataMap[
            cellarAddress!.toString().toLowerCase() + "-optimism"
          ] === undefined
        ) {
          console.warn(`${cellarAddress} not a valid cellar address`)
          return
        }

        let cellarDecimals =
          CellaAddressDataMap[
            cellarAddress!.toString().toLowerCase() + "-optimism"
          ].config.cellar.decimals

        let transformedData = fetchedOptimismData.Response[
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
        let tvl = getLatestTvlFromDaily(
          fetchedOptimismData,
          cellarAddress
        )

        let shareValue = 0
        if (transformedData.length === 0) {
          console.warn(
            `No data found for ${cellarAddress} on Optimism`
          )
        } else {
          shareValue = transformedData[0].shareValue
        }

        // Create a new response object with the transformed data
        let cellarObj = {
          id: cellarAddress.toLowerCase() + "-optimism",
          dayDatas: transformedData,
          shareValue: shareValue,
          tvlTotal: tvl,
          chain: chainSlugMap.OPTIMISM.id,
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

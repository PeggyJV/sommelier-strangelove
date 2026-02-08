import type { NextApiRequest, NextApiResponse } from "next"
import { CellaAddressDataMap } from "data/cellarDataMap"

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

type SommelierPoint = {
  unix_seconds: number
  share_price: number
  total_assets?: number | string
  tvl?: number | string
}

type SommelierSeriesResponse = {
  Response: SommelierPoint[]
}

type CellarMapRecord = {
  config: {
    cellar: {
      decimals: number
    }
  }
}

type TransformedPoint = {
  date: number
  shareValue: string
  total_assets?: number | string
  tvl?: number | string
}

const fetchData = async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return (await response.json()) as SommelierSeriesResponse
  } catch (error) {
    console.error("Fetch error:", error)
    return null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { cellarAddress, chain } = req.query
    if (!cellarAddress || !chain) {
      res.setHeader(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      res.setHeader("Access-Control-Allow-Origin", baseUrl)
      return res.status(200).json({
        status: "data_pending",
        note: "missing_params",
      })
    }

    const unix_timestamp_24_hours_ago =
      Math.floor(Date.now() / 1000) - 24 * 60 * 60

    const dailyDataUrl = `https://api.sommelier.finance/dailyData/${chain}/${cellarAddress}/0/latest`
    const hourlyDataUrl = `https://api.sommelier.finance/hourlyData/${chain}/${cellarAddress}/${unix_timestamp_24_hours_ago}/latest`

    const [dailyData, hourlyData] = await Promise.all([
      fetchData(dailyDataUrl),
      fetchData(hourlyDataUrl),
    ])

    if (!dailyData || !hourlyData) {
      res.setHeader(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      res.setHeader("Access-Control-Allow-Origin", baseUrl)
      return res.status(200).json({
        cellarAddress,
        chain,
        status: "data_pending",
        shareValue: null,
        tvlTotal: null,
        baseAssetTvl: null,
        note: "api_fetch_failed",
      })
    }

    let chainStr = ""
    if (chain !== "ethereum") {
      chainStr = "-" + chain
    }

    const key = cellarAddress!.toString().toLowerCase() + chainStr
    const cellarEntry = (CellaAddressDataMap as Record<
      string,
      CellarMapRecord
    >)?.[key]
    if (!cellarEntry) {
      res.setHeader(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      res.setHeader("Access-Control-Allow-Origin", baseUrl)
      return res.status(200).json({
        cellarAddress,
        chain,
        status: "data_pending",
        shareValue: null,
        tvlTotal: null,
        baseAssetTvl: null,
        note: "unknown_cellar_address",
      })
    }

    const cellarDecimals = cellarEntry.config.cellar.decimals

    const transformedDailyData: TransformedPoint[] = dailyData.Response.map(
      (dayData: SommelierPoint) => ({
        date: dayData.unix_seconds,
        // Multiply by cellarDecimals and drop any decimals
        shareValue: Math.floor(
          dayData.share_price * 10 ** cellarDecimals
        ).toString(),
      })
    )

    // Order by descending date
    transformedDailyData.sort((a, b) => b.date - a.date)

    // Do the same for hourly data
    const transformedHourlyData: TransformedPoint[] = hourlyData.Response.map(
      (hourData: SommelierPoint) => ({
        date: hourData.unix_seconds,
        // Multiply by cellarDecimals and drop any decimals
        shareValue: Math.floor(
          hourData.share_price * 10 ** cellarDecimals
        ).toString(),
        total_assets: hourData.total_assets,
        tvl: hourData.tvl,
      })
    )

    // Order by descending date
    transformedHourlyData.sort((a, b) => b.date - a.date)

    // Guard: if no hourly data, return data_pending instead of 500
    if (
      !Array.isArray(transformedHourlyData) ||
      transformedHourlyData.length === 0
    ) {
      res.setHeader(
        "Cache-Control",
        "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
      )
      res.setHeader("Access-Control-Allow-Origin", baseUrl)
      return res.status(200).json({
        cellarAddress,
        chain,
        status: "data_pending",
        shareValue: null,
        tvlTotal: null,
        baseAssetTvl: null,
        note: "no_hourly_data",
      })
    }

    // Most recent hourly
    const baseAssetTvl = Number(transformedHourlyData[0].tvl) // !! Note this TVL may be up to 1 hour stale bc it doesnt use the tvl api endpoint, not a huge deal but might be weird at launches

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
    console.error("API Error:", error)
    res.setHeader(
      "Cache-Control",
      "public, maxage=60, s-maxage=60, stale-while-revalidate=7200"
    )
    res.setHeader("Access-Control-Allow-Origin", baseUrl)
    res.status(200).json({
      cellarAddress: req.query.cellarAddress,
      chain: req.query.chain,
      status: "data_pending",
      shareValue: null,
      tvlTotal: null,
      baseAssetTvl: null,
      note: "internal_error",
    })
  }
}

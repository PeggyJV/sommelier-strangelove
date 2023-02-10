import { Datum, Serie } from "@nivo/line"
import { differenceInDays } from "date-fns"
import { toInteger } from "lodash"
import { colors } from "theme/colors"
import { formatDecimals } from "./bigNumber"

export const createTVLSeries = (
  data?: { date: number; tvlTotal: string }[]
): Serie[] | undefined => {
  if (!data) return

  return [
    {
      id: "tvl",
      data: data.map((item) => {
        return {
          x: new Date(item.date * 1000),
          y: formatDecimals(item.tvlTotal, 18),
        }
      }),
    },
  ]
}

export const createTokenPriceChangeDatum = (
  data?: { date: number; shareValue: string }[]
): Datum[] | undefined => {
  if (!data) return

  let datum: Datum[] = []
  data.map((item, index, arr) => {
    const firstData = data[0]
    if (firstData) {
      const current = item.shareValue
      const change = firstData
        ? ((toInteger(current) - toInteger(firstData.shareValue)) /
            toInteger(firstData.shareValue)) *
          100
        : 0
      datum.push({
        x: new Date(item.date * 1000),
        y: String(change),
        value: formatDecimals(current, 6, 6),
      })
    }
  })
  return datum
}

export const createEthBtcChartSeries = ({
  tokenPrice,
  ethBtc50,
  weth,
  wbtc,
  usdc,
}: {
  tokenPrice?: Datum[]
  ethBtc50?: Datum[]
  weth?: Datum[]
  wbtc?: Datum[]
  usdc?: Datum[]
}): Serie[] => {
  const minimal = Math.min(
    Number(tokenPrice?.length),
    // Number(ethBtc50?.length),
    Number(usdc?.length),
    Number(weth?.length),
    Number(wbtc?.length)
  )
  return [
    {
      id: "token-price",
      data: tokenPrice?.slice(0, minimal) || [],
      color: colors.neutral[100],
    },
    // {
    //   id: "eth-btc-50",
    //   data: ethBtc50?.slice(0, minimal) || [],
    //   color: colors.violet.base,
    // },
    {
      id: "usdc",
      data: usdc?.slice(0, minimal) || [],
      color: colors.violet.base,
    },
    {
      id: "weth",
      data: weth?.slice(0, minimal) || [],
      color: colors.turquoise.base,
    },
    {
      id: "wbtc",
      data: wbtc?.slice(0, minimal) || [],
      color: colors.orange.base,
    },
  ]
}

export const createUsdcChartSeries = ({
  tokenPrice,
  usdc,
}: {
  tokenPrice?: Datum[]
  usdc?: Datum[]
}): Serie[] => {
  const minimal = Math.min(
    Number(tokenPrice?.length),
    Number(usdc?.length)
  )
  return [
    {
      id: "token-price",
      data: tokenPrice?.slice(0, minimal) || [],
      color: colors.neutral[100],
    },
    {
      id: "usdc",
      data: usdc?.slice(0, minimal) || [],
      color: colors.violet.base,
    },
  ]
}

export const formatPercentage = (value: string) => {
  return parseFloat(value).toFixed(3)
}

export const createApyChangeDatum = ({
  launchEpoch,
  data,
}: {
  launchEpoch: number
  data?: { date: number; shareValue: string }[]
}): Datum[] | undefined => {
  if (!data) return
  let datum: Datum[] = []
  // Inception date (configured)
  const launchDate = new Date(launchEpoch * 1000)
  // Use yesterday's value, the most recent full day
  // query is ordered ascending by date, need to reverse it
  data.map((item, index, arr) => {
    const current = new Date(item.date * 1000)
    const daysSince = Math.abs(differenceInDays(current, launchDate))

    const currentValue = Number(item.shareValue)
    const startValue = 1000000 // 1 as 6 decimals
    const yieldGain = (currentValue - startValue) / startValue
    const apy = yieldGain * (365 / daysSince) * 100
    datum.push({
      x: new Date(item.date * 1000),
      y: String(apy.toFixed(1)) + "%",
      value: apy.toFixed(1),
    })
  })
  return datum
}

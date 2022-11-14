import { Datum, Serie } from "@nivo/line"
import { toInteger } from "lodash"
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
  data.map((item, index) => {
    const before = data[index - 1]
    if (before) {
      const current = item.shareValue
      const change = before
        ? ((toInteger(current) - toInteger(before.shareValue)) /
            toInteger(before.shareValue)) *
          100
        : 0
      datum.push({
        x: new Date(item.date * 1000),
        y: String(change),
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
}: {
  tokenPrice?: Datum[]
  ethBtc50?: Datum[]
  weth?: Datum[]
  wbtc?: Datum[]
}): Serie[] => {
  return [
    {
      id: "token-price",
      data: tokenPrice || [],
    },
    {
      id: "eth-btc-50",
      data: ethBtc50 || [],
    },
    {
      id: "weth",
      data: weth || [],
    },
    {
      id: "wbtc",
      data: wbtc || [],
    },
  ]
}

export const formatPercentage = (value: string) => {
  return parseFloat(value).toFixed(6)
}

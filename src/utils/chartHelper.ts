import { Datum, Serie } from "@nivo/line"
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
        value: formatDecimals(current, 6, 2),
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
      color: colors.purple.base,
    },
    {
      id: "eth-btc-50",
      data: ethBtc50 || [],
      color: colors.violet.base,
    },
    {
      id: "weth",
      data: weth || [],
      color: colors.turquoise.base,
    },
    {
      id: "wbtc",
      data: wbtc || [],
      color: colors.orange.base,
    },
  ]
}

export const formatPercentage = (value: string) => {
  return parseFloat(value).toFixed(2)
}

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

// Helper function to calculate rolling averages
function rollingAverage(arr: number[], windowSize: number) {
  const result = []
  for (let i = 0; i < arr.length - windowSize + 1; i++) {
    const window = arr.slice(i, i + windowSize)
    const average = window.reduce((a, b) => a + b, 0) / windowSize
    result.push(average)
  }
  return result
}

export const createApyChangeDatum = ({
  launchEpoch,
  data,
  decimals,
  smooth,
  daysSmoothed,
  daysRendered,
}: {
  launchEpoch: number
  data?: { date: number; shareValue: string }[]
  decimals: number
  smooth: boolean
  daysSmoothed: number
  daysRendered: number
}): Datum[] | undefined => {
  if (!data) return
  const datum: Datum[] = []
  // Inception date (configured)
  const launchDate = new Date(launchEpoch * 1000)
  let apyValues: number[] = []

  // If we're smoothing, apply rolling average twice over the smoothDuration
  // to smooth out the APY curve
  // Don't smooth if we don't have suffieicnt data, or we're showing data from
  if (smooth && data.length > daysSmoothed * 2 && daysSmoothed > 0) {
    const smoothDuration = daysSmoothed // Set the number of days for the rolling average

    // Calculate daily APY values
    apyValues = data.map((item, index) => {
      if (index === 0) {
        // no previous day to compare with for the first day
        return 0
      } else {
        const previous = data[index - 1]
        const currentValue = Number(item.shareValue)
        const previousValue = Number(previous.shareValue)
        const dailyApy =
          (currentValue / previousValue - 1) * 365 * 100

        return dailyApy
      }
    })

    // Apply rolling average twice over the smoothDuration to smooth out the APY curve
    apyValues = rollingAverage(apyValues, smoothDuration)

    // last smoothing is always over 7 days
    apyValues = rollingAverage(apyValues, 7)

  } else {
    // Calculate overall (non daily) APY values without smoothing
    apyValues = data.map((item) => {
      const current = new Date(item.date * 1000)
      const daysSince = Math.abs(
        differenceInDays(current, launchDate)
      )

      const currentValue = Number(item.shareValue)
      const startValue = 10 ** decimals
      const yieldGain = (currentValue - startValue) / startValue
      const apy = yieldGain * (365 / daysSince) * 100

      return apy
    })
  }

  // Modify apyValues to be the last daysRendered worth of values
  if (daysRendered > 0 && apyValues.length > daysRendered) {
    apyValues.splice(0, apyValues.length - daysRendered)
    // Update all the dates as well
    data.splice(0, data.length - daysRendered)
  }

  // Construct the final datum array with the smoothed APY values
  data.forEach((item, index) => {
    const apyValue = apyValues[index]
    if (!isNaN(apyValue)) {
      datum.push({
        x: new Date(item.date * 1000),
        y: String(apyValue.toFixed(1)) + "%",
        value: apyValue,
      })
    }
  })

  return datum
}

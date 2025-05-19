import { differenceInDays } from "date-fns"

export const createTokenPriceChangeDatum = (
  data?: { date: number; shareValue: string }[]
): { x: Date; y: string }[] | undefined => {
  if (!data) return

  let datum: { x: Date; y: string }[] = []
  data.map((item, index, arr) => {
    const firstData = data[data.length - 1]
    if (firstData) {
      const current = item.shareValue
      const change = firstData
        ? ((parseInt(current) - parseInt(firstData.shareValue)) /
            parseInt(firstData.shareValue)) *
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
}): { x: Date; y: string, value: number }[] | undefined => {
  if (!data) return
  if (data.length < 2) return

  const datum: { x: Date; y: string, value: number }[] = []
  // Inception date (configured)
  const launchDate = new Date(launchEpoch * 1000)
  let apyValues: number[] = []

  // Make earliest data first if it's not already
  if (data[0].date > data[data.length - 1].date) {
    data.reverse()
  }

  // If we're smoothing, apply rolling average twice over the smoothDuration
  // to smooth out the APY curve
  // Don't smooth if we don't have suffieicnt data, or we're showing data from
  if (smooth && data.length > daysSmoothed && daysSmoothed > 0) {
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

    // For 30D MA -- Apply rolling average twice over the smoothDuration to smooth out the APY curve
    //if (daysRendered === 30) {
    //  apyValues = rollingAverage(apyValues, 3)
    //  apyValues = rollingAverage(apyValues, smoothDuration)
    //} else {
      // Pure MA
    apyValues = rollingAverage(apyValues, smoothDuration)
    //}
  } else {
    console.log("Not smoothing")
    // Calculate overall (non daily) APY values without smoothing
    apyValues = data.map((item) => {
      const current = new Date(item.date * 1000)
      const daysSince = Math.abs(
        differenceInDays(current, launchDate)
      )

      // If days since is 0, skip the calculation to avoid dividing by 0
      if (daysSince === 0) return 0

      const currentValue = Number(item.shareValue)
      const startValue = 10 ** decimals
      const yieldGain = (currentValue - startValue) / startValue
      const apy = yieldGain * (365 / daysSince) * 100

      return apy
    })
  }

  // Drop the first value if it's 0
  if (apyValues[0] === 0) {
    apyValues.shift()
    data.shift()
  }

  // Modify apyValues to be the last daysRendered worth of values
  if (daysRendered > 0 && apyValues.length >= daysRendered) {
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

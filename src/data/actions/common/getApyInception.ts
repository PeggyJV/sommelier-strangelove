import { differenceInDays } from "date-fns"
import BigNumber from "bignumber.js"

export const getApyInception = ({
  baseApy,
  dayDatas,
  hardcodedApy,
  launchEpoch,
  decimals,
  startingShareValue,
}: {
  baseApy?: number
  dayDatas?: { date: number; shareValue: string }[]
  hardcodedApy?: boolean
  launchEpoch: number
  decimals: number
  startingShareValue?: string | undefined | null
}) => {
  const isDataNotValid =
    !dayDatas || dayDatas?.length === 1 || dayDatas?.length < 2

  // cellar apy
  const cellarApy = (() => {
    if (isDataNotValid || hardcodedApy) {
      return baseApy || 0
    }

    // Inception date (configured)
    const launchDate = new Date(launchEpoch * 1000)
    // Use yesterday's value, the most recent full day
    const yesterday = new Date(dayDatas[1].date * 1000)
    const daysSince = Math.abs(
      differenceInDays(yesterday, launchDate)
    )

    // Starting value generally is 1 asset. This may be overriden via config.
    let startValue
    if (startingShareValue == null) {
      // No start value provided, use default of 10 ** decimals (usually 6)
      startValue = new BigNumber(10 ** decimals)
    } else {
      startValue = new BigNumber(startingShareValue)
    }

    const nowValue = new BigNumber(dayDatas[1].shareValue)
    const yieldGain = nowValue.minus(startValue).div(startValue)

    // Take the gains since inception and annualize it to get APY since inception
    return yieldGain.times(365).div(daysSince).times(100).toNumber()
  })()
  if (!cellarApy) return
  return {
    formatted: cellarApy.toFixed(2) + "%",
    value: Number(cellarApy.toFixed(1)),
  }
}

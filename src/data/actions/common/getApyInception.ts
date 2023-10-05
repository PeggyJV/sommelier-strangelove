import { differenceInDays } from "date-fns"
import BigNumber from "bignumber.js"

export const getApyInception = ({
  baseApy,
  shareData,
  hardcodedApy,
  launchEpoch,
  decimals,
  startingShareValue,
}: {
  baseApy?: number
  shareData?: { date: number; shareValue: string } | undefined | null
  hardcodedApy?: boolean
  launchEpoch: number
  decimals: number
  startingShareValue?: string | undefined | null
}) => {
  const isDataNotValid = !shareData

  // cellar apy
  const cellarApy = (() => {
    if (isDataNotValid || hardcodedApy) {
      return baseApy || 0
    }

    // Inception date (configured)
    const launchDate = new Date(launchEpoch * 1000)
    const yesterday = new Date(shareData.date * 1000)
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

    // Now val must have same amt of digits as startValue
    const nowValue = new BigNumber(
      new BigNumber(shareData.shareValue)
        .toString()
        .substring(0, startValue.toString().length)
    )
    const yieldGain = nowValue.minus(startValue).div(startValue)

    // Take the gains since inception and annualize it to get APY since inception
    return yieldGain.times(365).div(daysSince).times(100).toNumber()
  })()
  if (!cellarApy) return
  return {
    formatted: cellarApy.toFixed(2) + "%",
    value: Number(cellarApy.toFixed(2)),
  }
}

import { differenceInDays } from "date-fns"

export const getBaseApy = ({
  baseApy,
  dayDatas,
  hardcodedApy,
  launchEpoch,
}: {
  baseApy?: number
  dayDatas?: { date: number; shareValue: string }[]
  hardcodedApy?: boolean
  launchEpoch: number
}) => {
  const isUsingHardcodedApy =
    !dayDatas || (dayDatas?.length === 1 && hardcodedApy)

  // cellar apy
  const cellarApy = (() => {
    if (isUsingHardcodedApy || dayDatas.length < 2) {
      return baseApy || 0
    }

    // Inception date (configured)
    const launchDate = new Date(launchEpoch * 1000)
    // Use yesterday's value, the most recent full day
    const yesterday = new Date(dayDatas[1].date * 1000)
    const daysSince = Math.abs(
      differenceInDays(yesterday, launchDate)
    )

    const nowValue = Number(dayDatas[1].shareValue)
    const startValue = 1000000 // 1 as 6 decimals
    const yieldGain = (nowValue - startValue) / startValue

    return yieldGain * (365 / daysSince) * 100
  })()
  if (!cellarApy) return
  return {
    formatted: cellarApy.toFixed(1) + "%",
    value: Number(cellarApy.toFixed(1)),
  }
}

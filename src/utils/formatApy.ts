import { CellarDayData } from "generated/subgraph"

export const formatApy = (dayDatas?: CellarDayData[]) => {
  if (!dayDatas) {
    return null
  }

  const totalEarnings = dayDatas.reduce(
    (acc, dayData) => acc + dayData.earnings,

    {} as number
  )
  const totalTvlInvested = dayDatas.reduce(
    (acc, dayData) => acc + dayData.tvlInvested,
    {} as number
  )
  const totalYield = totalEarnings / totalTvlInvested
  const days = dayDatas.length
  const periodsInYear = 365 / days
  const apy = ((1 + totalYield) ^ (periodsInYear - 1)) * 100

  const apyVal = (apy * 100).toFixed(2)

  return apyVal
}

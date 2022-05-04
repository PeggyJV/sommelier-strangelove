import { CellarDayData } from "generated/subgraph"

export const formatApy = (
  dayDatas?: Partial<CellarDayData>[]
): string | undefined => {
  if (!dayDatas) {
    return undefined
  }

  const totalEarnings: number = dayDatas.reduce((acc, dayData, i) => {
    const previousDayData = i > 0 ? dayDatas[i - 1] : undefined
    const rebalance: boolean = dayData.date === previousDayData?.date
    const rebalanceEarnings: number =
      dayData.earnings + previousDayData?.earnings

    return rebalance
      ? acc + rebalanceEarnings
      : acc + dayData.earnings
  }, 0)
  const tvlInvested: number =
    dayDatas[dayDatas.length - 1].tvlInvested
  const totalYield: number = totalEarnings / tvlInvested
  const days: number = dayDatas.length
  const periodsInYear: number = 365 / days
  const apy: number = ((1 + totalYield) ^ (periodsInYear - 1)) * 100

  const apyVal: string = (apy * 100).toFixed(2)

  console.log({
    totalEarnings,
    tvlInvested,
    totalYield,
    days,
    periodsInYear,
    apy,
    apyVal,
  })

  return apyVal
}

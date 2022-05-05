import { CellarDayData } from "generated/subgraph"
import { BigNumber, FixedNumber } from "@ethersproject/bignumber"

export const formatApy = (
  dayDatas?: Partial<CellarDayData>[]
): string | undefined => {
  if (!dayDatas) {
    return undefined
  }
  console.log({ dayDatas })

  const totalEarnings: BigNumber = dayDatas.reduce(
    (acc, dayData, i) => {
      const previousDayData = i > 0 ? dayDatas[i - 1] : undefined
      const rebalance: boolean =
        dayData.date === previousDayData?.date

      const rebalanceEarnings = rebalance
        ? BigNumber.from(dayData.earnings).add(
            BigNumber.from(previousDayData?.earnings)
          )
        : undefined

      return rebalance
        ? acc.add(rebalanceEarnings!)
        : acc.add(BigNumber.from(dayData.earnings))
    },
    BigNumber.from(0)
  )
  const tvlInvested: BigNumber = BigNumber.from(
    dayDatas[dayDatas.length - 1].tvlInvested
  )
  const totalYield: BigNumber = totalEarnings.div(tvlInvested)
  const days: number = dayDatas.length
  const periodsInYear: number = 365 / days
  const apy: BigNumber = BigNumber.from(1)
    .add(totalYield)
    .pow(FixedNumber.from(periodsInYear).subUnsafe(1))
    .mul(100)

  const apyVal: any = apy.mul(100)

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

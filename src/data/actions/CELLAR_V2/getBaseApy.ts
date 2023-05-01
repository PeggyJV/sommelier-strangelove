import { differenceInDays } from "date-fns"
import BigNumber from "bignumber.js"
import { realYieldEth } from "../../strategies/real-yield-eth"

const RYETH_LAUNCH_EPOCH = Math.floor(
  realYieldEth.launchDate.getTime() / 1000
)

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

    // FIXME: use the correct start value by multiplying 1 * decimals
    // get decimals from subgraph via cellar.asset.decimals
    let startValue = new BigNumber("1000000")
    if (launchEpoch === RYETH_LAUNCH_EPOCH) {
      startValue = new BigNumber("1000000000000000000")
    }

    const nowValue = new BigNumber(dayDatas[1].shareValue)
    const yieldGain = nowValue.minus(startValue).div(startValue)

    return yieldGain.times(365).div(daysSince).times(100).toNumber()
  })()
  if (!cellarApy) return
  return {
    formatted: cellarApy.toFixed(1) + "%",
    value: Number(cellarApy.toFixed(1)),
  }
}

import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"
import differenceInDays from "date-fns/differenceInDays"

export const getApy = async ({
  stakerContract,
  sommPrice,
  baseApy,
  dayDatas,
  hardcodedApy,
  launchEpoch,
}: {
  stakerContract: CellarStakingV0815
  sommPrice: string
  baseApy?: number
  dayDatas?: { date: number; shareValue: string }[]
  hardcodedApy?: boolean
  launchEpoch: number
}) => {
  try {
    const stakingEnd = await stakerContract.endTimestamp()
    const isStakingOngoing = Date.now() < stakingEnd.toNumber() * 1000
    const isUsingHardcodedApy =
      !dayDatas || (dayDatas?.length === 1 && hardcodedApy)

    let potentialStakingApy = new BigNumber(0)
    if (isStakingOngoing) {
      const rewardRateRes = await stakerContract.rewardRate()
      const rewardRate = new BigNumber(
        rewardRateRes.toString()
      ).dividedBy(new BigNumber(10).pow(6))

      const totalDepositWithBoostRes =
        await stakerContract.totalDepositsWithBoost()
      const totalDepositWithBoost = new BigNumber(
        totalDepositWithBoostRes.toString()
      ).dividedBy(new BigNumber(10).pow(18))
      const withUserDeposit = totalDepositWithBoost.plus(10000)

      potentialStakingApy = rewardRate
        .multipliedBy(sommPrice)
        .dividedBy(withUserDeposit)
        .multipliedBy(365 * 24 * 60 * 60)
        .multipliedBy(100)
    }

    // cellar apy since inception
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

    const apyLabel = isUsingHardcodedApy
      ? "Backtested APY, will be updated to live APY next week"
      : ""

    return {
      apy: cellarApy.toFixed(1) + "%",
      apyLabel,
      expectedApy:
        (cellarApy + Number(potentialStakingApy)).toFixed(1) + "%",
      potentialStakingApy:
        potentialStakingApy.toFixed(1).toString() + "%",
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}

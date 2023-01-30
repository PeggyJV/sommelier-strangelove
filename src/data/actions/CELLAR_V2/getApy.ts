import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"

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

    // cellar apy
    const cellarApy = (() => {
      if (!dayDatas || dayDatas.length === 1 || hardcodedApy) {
        return baseApy || 0
      }

      // dayDatas is ordered by date desc
      const seventhDayIdx = 6 // Index of 7 days before today
      const today = dayDatas[0]

      // Try to find the index of the day before the launch
      // then subtract 1 to get the index of the day of the launch
      const launchIdx =
        dayDatas.findIndex((day) => day.date < launchEpoch) - 1

      let numDays = 7
      let prevIdx = seventhDayIdx
      if (launchIdx >= 0 && launchIdx < seventhDayIdx) {
        // It has been less than a week since launch
        numDays = launchIdx + 1
        prevIdx = launchIdx
      }

      const todayValue = today.shareValue
      const previousValue = dayDatas[prevIdx].shareValue
      const yieldGain =
        (Number(todayValue) - Number(previousValue)) /
        Number(previousValue)

      return yieldGain * (365 / numDays) * 100
    })()

    // const apyLabel = `Expected APY is the sum of the Cellar APY ${cellarApy.toFixed(
    //   1
    // )}% and the Rewards APY ${potentialStakingApy
    //   .toFixed(1)
    //   .toString()}%.`
    const apyLabel =
      cellarApy === baseApy
        ? "Backtested APY will be updated to live APY next week"
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

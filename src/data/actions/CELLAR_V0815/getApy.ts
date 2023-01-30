import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"

const yearInSecs = 60 * 60 * 24 * 365
const yearInSecsBN = new BigNumber(yearInSecs)

export const getApy = async ({
  stakerContract,
  sommPrice,
  baseApy,
  dayDatas,
  hardcodedApy,
}: {
  stakerContract: CellarStakingV0815
  sommPrice: string
  baseApy?: number
  dayDatas?: { date: number; shareValue: string }[]
  hardcodedApy?: boolean
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
      if (!dayDatas || hardcodedApy) {
        return baseApy || 0
      }
      const indexThatHaveChanges = dayDatas.findIndex(
        (data, idx, arr) => {
          if (idx === 0) return false // return false because first data doesn't have comparison

          const prev = arr[idx - 1].shareValue
          return prev !== data.shareValue
        }
      )
      if (indexThatHaveChanges === -1) return 0

      // dayDatas is in desc order
      const latestDataChanged =
        dayDatas[indexThatHaveChanges - 1].shareValue
      const prevDayLatestData =
        dayDatas[indexThatHaveChanges].shareValue

      const yieldGain =
        (Number(latestDataChanged) - Number(prevDayLatestData)) /
        Number(prevDayLatestData)

      return yieldGain * 52 * 100
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

import BigNumber from "bignumber.js"
import { CellarStakingV0815, CellarV0815 } from "src/abi/types"

const yearInSecs = 60 * 60 * 24 * 365
const yearInSecsBN = new BigNumber(yearInSecs)

export const getApy = async (
  cellarContract: CellarV0815,
  stakerContract: CellarStakingV0815,
  sommPrice: string,
  dayDatas: { date: number; shareValue: string }[]
) => {
  try {
    const maxLocked = new BigNumber(
      (await cellarContract.maxLocked()).toString()
    )
    const totalAssets = new BigNumber(
      (await cellarContract.totalAssets()).toString()
    )
    const accrualPeriod = new BigNumber(
      (await cellarContract.accrualPeriod()).toString()
    )
    const accrualPeriodsInYear = yearInSecsBN.dividedBy(accrualPeriod)
    const apy = maxLocked
      .dividedBy(totalAssets)
      .multipliedBy(accrualPeriodsInYear)
      .multipliedBy(100)

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

    const stakingEnd = await stakerContract.endTimestamp()
    const isStakingOngoing = Date.now() < stakingEnd.toNumber() * 1000

    let potentialStakingApy = new BigNumber(0)
    if (isStakingOngoing) {
      potentialStakingApy = rewardRate
        .multipliedBy(sommPrice)
        .dividedBy(withUserDeposit)
        .multipliedBy(365 * 24 * 60 * 60)
        .multipliedBy(100)
    }

    // cellar apy
    const cellarApy = (() => {
      const indexThatHaveChanges = dayDatas.findIndex(
        (data, idx, arr) => {
          if (idx === 0) return false // return false because first data doesn't have comparation

          const prev = arr[idx + 1].shareValue
          return prev !== data.shareValue
        }
      )
      if (indexThatHaveChanges === -1) return 0
      const latestDataChanged =
        dayDatas[indexThatHaveChanges].shareValue
      const prevDayLatestData =
        dayDatas[indexThatHaveChanges + 1].shareValue

      const yieldGain =
        (Number(latestDataChanged) - Number(prevDayLatestData)) /
        Number(prevDayLatestData)
      return yieldGain * 52 * 100
    })()

    const apyLabel = `Expected APY is the sum of the Cellar APY ${cellarApy.toFixed(
      1
    )}% and the Rewards APY ${potentialStakingApy
      .toFixed(1)
      .toString()}%.`

    return {
      apy: cellarApy.toFixed(1),
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

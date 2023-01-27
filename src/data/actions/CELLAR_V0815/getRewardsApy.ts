import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"

export const getRewardsApy = async (
  stakerContract: CellarStakingV0815,
  sommPrice: string,
  baseApy?: number
) => {
  try {
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

    const apyLabelWithBaseApy = `Expected APY is the sum of the base backtested cellar APY ${baseApy}% and the Rewards APY ${potentialStakingApy
      .toFixed(1)
      .toString()}%.`
    const apyLabel = `Expected Rewards APY`
    const rewardsApy = potentialStakingApy.toFixed(1) + "%"
    const expectedApy = baseApy
      ? (baseApy + Number(potentialStakingApy.toFixed(1))).toFixed(
          1
        ) + "%"
      : potentialStakingApy.toFixed(1) + "%"
    return {
      apy: baseApy + "%",
      apyLabel: baseApy ? apyLabelWithBaseApy : apyLabel,
      potentialStakingApy: rewardsApy,
      expectedApy: expectedApy,
    }
  } catch (error) {
    console.warn("Cannot read cellar data", error)
    throw error
  }
}

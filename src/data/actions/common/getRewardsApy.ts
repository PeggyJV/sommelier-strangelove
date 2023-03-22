import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"

export const getRewardsApy = async ({
  stakerContract,
  sommPrice,
}: {
  stakerContract: CellarStakingV0815
  sommPrice: string
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
    return {
      formatted: potentialStakingApy.toFixed(1).toString() + "%",
      value: Number(potentialStakingApy.toFixed(1)),
    }
  } catch (error) {
    console.warn(error)
    return
  }
}

import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"

export const getRewardsApy = async ({
  stakerContract,
  sommPrice,
  assetPrice,
}: {
  stakerContract: CellarStakingV0815
  sommPrice: string
  assetPrice: string
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

      // Assuming a user deposits 10k worth of the asset
      const userDeposit = new BigNumber(10000).div(assetPrice)
      const withUserDeposit = totalDepositWithBoost
        .plus(userDeposit)
        .times(assetPrice)

      potentialStakingApy = rewardRate
        .multipliedBy(sommPrice)
        .dividedBy(withUserDeposit)
        .multipliedBy(365 * 24 * 60 * 60)
        .multipliedBy(100)
    }
    return {
      formatted: potentialStakingApy.toFixed(2).toString() + "%",
      value: Number(potentialStakingApy.toFixed(1)),
    }
  } catch (error) {
    console.warn(error)
    return
  }
}

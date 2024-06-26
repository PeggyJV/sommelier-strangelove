import { ConfigProps } from "data/types"
import { formatUnits } from "viem"

export const getRewardsApy = async ({
  stakerContract,
  sommPrice,
  assetPrice,
  cellarConfig,
}: {
  stakerContract: any
  sommPrice: string
  assetPrice: string
  cellarConfig: ConfigProps
}) => {
  try {
    console.log(assetPrice)
    const stakingEnd = await stakerContract.read.endTimestamp()
    const isStakingOngoing = Date.now() < stakingEnd.toNumber() * 1000

    let potentialStakingApy = BigInt(0)
    if (isStakingOngoing) {
      const rewardRateRes = await stakerContract.read.rewardRate()
      const rewardRate = formatUnits(rewardRateRes, 6)


      const totalDepositWithBoostRes =
        await stakerContract.totalDepositsWithBoost()
      const totalDepositWithBoost =
        formatUnits(totalDepositWithBoostRes.toString(), cellarConfig.cellar.decimals)

      // Assuming a user deposits 10k worth of the asset
      const userDeposit = BigInt(10000 / Number(assetPrice))
      const withUserDeposit = BigInt(totalDepositWithBoost + userDeposit * BigInt(assetPrice))
      potentialStakingApy = BigInt(rewardRate)
        * BigInt(sommPrice)
        / withUserDeposit
        * BigInt(365 * 24 * 60 * 60 * 100)

    }


    console.log({
      formatted: potentialStakingApy.toString() + "%",
      value: Number(potentialStakingApy).toFixed(1),
    })
    return {
      formatted: potentialStakingApy.toString() + "%",
      value: Number(potentialStakingApy).toFixed(1),
    }
  } catch (error) {
    console.warn(error)
    return
  }
}

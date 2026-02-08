import { ConfigProps } from "data/types"
import { formatUnits } from "viem"

export const getRewardsApy = async ({
  stakerContract,
  sommPrice,
  assetPrice,
  cellarConfig,
}: {
  stakerContract: unknown
  sommPrice: string
  assetPrice: string
  cellarConfig: ConfigProps
}) => {
  try {
    const contract = stakerContract as {
      read: {
        endTimestamp: () => Promise<bigint>
        rewardRate: () => Promise<bigint>
        totalDepositsWithBoost: () => Promise<bigint>
      }
    }

    const stakingEnd = await contract.read.endTimestamp()
    const isStakingOngoing = BigInt(Date.now()) < stakingEnd * 1000n;

    let potentialStakingApy = 0
    if (isStakingOngoing) {
      const rewardRateRes = await contract.read.rewardRate()
      const rewardRate = formatUnits(rewardRateRes, 6)


      const totalDepositWithBoostRes =
        await contract.read.totalDepositsWithBoost()
      const totalDepositWithBoost =
        formatUnits(totalDepositWithBoostRes, cellarConfig.cellar.decimals)

      // Assuming a user deposits 10k worth of the asset
      const userDeposit = 10000 / Number(assetPrice)
      const withUserDeposit = (Number(totalDepositWithBoost) + userDeposit) * Number(assetPrice)

      potentialStakingApy = Number(rewardRate)
        * Number(sommPrice)
        / withUserDeposit
        * 365 * 24 * 60 * 60 * 100

    }

    return {
      formatted: potentialStakingApy.toFixed(2) + "%",
      value: potentialStakingApy,
    }
  } catch (error) {
    console.warn(error)
    return
  }
}

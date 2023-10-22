import BigNumber from "bignumber.js"
import { CellarStakingV0815 } from "src/abi/types"
import { ConfigProps } from "data/types"
import { getContract, getProvider, fetchSigner } from "@wagmi/core"
import { Contract } from "ethers"

export const getRewardsApy = async ({
  stakerContract,
  cellarContract,
  sommPrice,
  assetPrice,
  cellarConfig,
}: {
  stakerContract: CellarStakingV0815
  cellarContract: Contract
  sommPrice: string
  assetPrice: string
  cellarConfig: ConfigProps
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

      let oneShare = new BigNumber(10).pow(
        cellarConfig.cellar.decimals
      )
      let shareValueBaseAsset = new BigNumber(
        (await cellarContract
          .previewRedeem(oneShare.toString()))
          .toString()
      )

      // Standardize decimals
      shareValueBaseAsset = shareValueBaseAsset.dividedBy(
        new BigNumber(10).pow(cellarConfig.cellar.decimals)
      )

      const totalDepositWithBoostRes =
        await stakerContract.totalDepositsWithBoost()
      const totalDepositWithBoost = new BigNumber(
        totalDepositWithBoostRes.toString()
      ).dividedBy(new BigNumber(10).pow(cellarConfig.cellar.decimals))

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

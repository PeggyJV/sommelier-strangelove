import BigNumber from "bignumber.js"
import { ethers } from "ethers"
import { CellarStakingV0815 } from "src/abi/types"
import { toEther } from "utils/formatCurrency"
import { StakerUserData, UserStake } from "../types"

export const getUserStakes = async (
  address: string,
  stakerContract: CellarStakingV0815,
  stakerSigner: CellarStakingV0815,
  sommelierPrice: string
) => {
  try {
    if (!stakerSigner.provider || !stakerSigner.signer) {
      throw new Error("provider or signer is undefined")
    }

    const userStakes = await stakerContract.getUserStakes(address)

    const claimAllRewards = await stakerSigner.callStatic.claimAll()
    let totalClaimAllRewards = new BigNumber(0)
    claimAllRewards.length &&
      claimAllRewards.forEach((reward) => {
        totalClaimAllRewards = totalClaimAllRewards.plus(
          new BigNumber(reward.toString())
        )
      })

    let userStakesArray: UserStake[] = []
    let totalRewards = new BigNumber(0)
    let totalBondedAmount = new BigNumber(0)

    userStakes.forEach((item) => {
      const [
        amount,
        amountWithBoost,
        unbondTimestamp,
        rewardPerTokenPaid,
        rewards,
        lock,
      ] = item

      totalRewards = totalRewards.plus(
        new BigNumber(rewards.toString())
      )
      totalBondedAmount = totalBondedAmount.plus(
        new BigNumber(amount.toString())
      )
      userStakesArray.push({
        amount: new BigNumber(amount.toString()),
        amountWithBoost: new BigNumber(amountWithBoost.toString()),
        rewardPerTokenPaid: new BigNumber(
          rewardPerTokenPaid.toString()
        ),
        rewards: new BigNumber(rewards.toString()),
        unbondTimestamp,
        lock,
      })
    })

    const claimAllRewardsUSD = totalClaimAllRewards
      .div(new BigNumber(10).pow(6)) // convert from 6 decimals
      .multipliedBy(new BigNumber(sommelierPrice))

    const convertedClaimAllRewards = claimAllRewards.map(
      (item) => new BigNumber(item.toString())
    )

    const userStakeData: StakerUserData = {
      // It's actually list of claimable rewards
      claimAllRewards: convertedClaimAllRewards,
      claimAllRewardsUSD,
      totalBondedAmount: {
        value: totalBondedAmount,
        formatted: toEther(
          ethers.utils.parseUnits(totalBondedAmount?.toFixed(), 0),
          18,
          false,
          2
        ),
      },
      totalClaimAllRewards: {
        value: totalClaimAllRewards,
        formatted: toEther(
          totalClaimAllRewards?.toFixed(),
          6,
          false,
          2
        ),
      },
      totalRewards,
      userStakes: userStakesArray,
    }
    return userStakeData
  } catch (error) {
    console.warn(error)

    throw error
  }
}

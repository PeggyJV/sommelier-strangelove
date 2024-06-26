import { toEther } from "utils/formatCurrency"
import { StakerUserData, UserStake } from "../types"
import { ConfigProps } from "data/types"
import { formatUnits } from "viem"

export const getUserStakes = async (
  address: string,
  stakerContract: any,
  sommelierPrice: string,
  strategyConfig: ConfigProps
) => {
  try {

    if (!stakerContract) {
      throw new Error("provider is undefined")
    }

    const userStakes = await stakerContract.read.getUserStakes([address])

    const claimAllRewards = await stakerContract.simulate.claimAll({account: address})


    let totalClaimAllRewards = BigInt(0)
    claimAllRewards.result.length &&
      claimAllRewards.result.forEach((reward: bigint) => {
        totalClaimAllRewards = totalClaimAllRewards + reward
      })

    let userStakesArray: UserStake[] = []
    let totalRewards = BigInt(0)
    let totalBondedAmount = BigInt(0)


    userStakes.forEach((item: any) => {
      const {
        amount,
        amountWithBoost,
        unbondTimestamp,
        rewardPerTokenPaid,
        rewards,
        lock,
      } = item

      totalRewards = totalRewards + BigInt(rewards)
      totalBondedAmount = totalBondedAmount + BigInt(amount)
      userStakesArray.push({
        amount: BigInt(amount),
        amountWithBoost: BigInt(amountWithBoost),
        rewardPerTokenPaid: BigInt(rewardPerTokenPaid),
        rewards: BigInt(rewards),
        unbondTimestamp,
        lock,
      })
    })

    //!!!!!!!! TODO This is hardcoded for somm
    const claimAllRewardsUSD = Number(formatUnits(totalClaimAllRewards, 6)) * Number(sommelierPrice)

    const userStakeData: StakerUserData = {
      // It's actually list of claimable rewards
      claimAllRewards: claimAllRewards.result,
      claimAllRewardsUSD,
      totalBondedAmount: {
        value: totalBondedAmount,
        formatted:
          toEther(
            totalBondedAmount,
            strategyConfig.cellar.decimals, // Must be cellar decimals
            false,
            2
          ),
      },
      totalClaimAllRewards: {
        value: totalClaimAllRewards,
        formatted:
          toEther(
            totalClaimAllRewards,
            6, // TODO: Post incentive refractor this must be the incentive asset decimals (Hardcoded for somm)
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

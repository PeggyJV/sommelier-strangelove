import { CellarStakingV0815 } from "src/abi/types"
import { toEther } from "utils/formatCurrency"
import { StakerUserData, UserStake } from "../types"
import { ConfigProps } from "data/types"
import { formatUnits } from "viem"
import { bigIntToFixed } from "utils/bigIntHelpers"

export const getUserStakes = async (
  address: string,
  stakerContract,
  stakerSigner,
  sommelierPrice: string,
  strategyConfig: ConfigProps
) => {
  try {

    if (!stakerContract || !stakerSigner) {
      throw new Error("provider or signer is undefined")
    }

    const userStakes = await stakerContract.read.getUserStakes([address])

    const claimAllRewards = await stakerSigner.simulate.claimAll()

    let totalClaimAllRewards = BigInt(0)
    claimAllRewards.length &&
      claimAllRewards.forEach((reward) => {
        totalClaimAllRewards = totalClaimAllRewards + BigInt(reward)
      })

    let userStakesArray: UserStake[] = []
    let totalRewards = BigInt(0)
    let totalBondedAmount = BigInt(0)

    userStakes.forEach((item) => {
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
    const claimAllRewardsUSD = BigInt(Number(formatUnits(totalClaimAllRewards, 6)) * Number(sommelierPrice))

    const convertedClaimAllRewards = claimAllRewards.result.map(
      (item) => BigInt(item)
    )

    const userStakeData: StakerUserData = {
      // It's actually list of claimable rewards
      claimAllRewards: convertedClaimAllRewards,
      claimAllRewardsUSD,
      totalBondedAmount: {
        value: totalBondedAmount,
        formatted:
          toEther(
            bigIntToFixed(totalBondedAmount),
            strategyConfig.cellar.decimals, // Must be cellar decimals
            false,
            2
          ),
      },
      totalClaimAllRewards: {
        value: totalClaimAllRewards,
        formatted:
          toEther(
            bigIntToFixed(totalClaimAllRewards),
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

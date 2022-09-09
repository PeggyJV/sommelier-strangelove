import BigNumber from "bignumber.js"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { SommStaking } from "src/abi/types"
import { StakerUserData, UserStake } from "../types"

export const fetchStakerUserData = async (
  contract: SommStaking,
  signer: SommStaking,
  address: string
) => {
  try {
    if (!signer.provider || !signer.signer) {
      throw new Error("provider or signer is undefined")
    }
    const sommPrice = await fetchCoingeckoPrice("sommelier", "usd")
    if (!sommPrice) {
      throw new Error("sommelierPrice is undefined")
    }

    const userStakes = await contract.getUserStakes(address)

    const claimAllRewards = await signer.callStatic.claimAll()
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
      .multipliedBy(new BigNumber(sommPrice))

    const convertedClaimAllRewards = claimAllRewards.map(
      (item) => new BigNumber(item.toString())
    )

    const userStakeData: StakerUserData = {
      claimAllRewards: convertedClaimAllRewards,
      claimAllRewardsUSD,
      totalBondedAmount,
      totalClaimAllRewards,
      totalRewards,
      userStakes: userStakesArray,
    }
    return userStakeData
  } catch (error) {
    console.warn(error)

    throw error
  }
}

import BigNumber from "bignumber.js"
import { BigNumber as BigNumberE } from "ethers"

export interface UserStake {
  amount: BigNumberE
  amountWithBoost: BigNumberE
  rewardPerTokenPaid: BigNumberE
  rewards: BigNumberE
  unbondTimestamp: number
  lock: number
  // maxDeposit?: BigNumberE
}
export interface StakerUserData {
  claimAllRewards: BigNumberE[]
  claimAllRewardsUSD: BigNumber
  totalBondedAmount: BigNumber
  totalClaimAllRewards: BigNumber
  totalRewards: BigNumber
  userStakes: UserStake[]
}

export interface StakerData {
  rewardRate: BigNumber
  potentialStakingApy: BigNumber
}

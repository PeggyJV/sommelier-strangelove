import BigNumber from "bignumber.js"

export interface UserStake {
  amount: BigNumber
  amountWithBoost: BigNumber
  rewardPerTokenPaid: BigNumber
  rewards: BigNumber
  unbondTimestamp: number
  lock: number
}
export interface StakerUserData {
  claimAllRewards: BigNumber[]
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

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
  totalBondedAmount: {
    value: BigNumber
    formatted: string
  }
  totalClaimAllRewards: {
    value: BigNumber
    formatted: string
  }
  totalRewards: BigNumber
  userStakes: UserStake[]
}

export interface StakerData {
  rewardRate: BigNumber
  potentialStakingApy: BigNumber
}

export interface CellarData {
  activeAsset: string
  name: string
  maxLocked: BigNumber
  accrualPeriod: BigNumber
  totalAssets: BigNumber
  apy: BigNumber
}

export interface CellarUserData {
  maxDeposit: BigNumber
  maxWithdraw: BigNumber
  netValue: BigNumber
}

export interface DepositAndSwapPayload {
  selectedToken?: {
    address: string
    decimals: number
    symbol: string
  }
  activeAsset?: {
    address: string
    decimals: number
    symbol: string
  }
  cellarAddress: string
  depositAmount: number
  slippage: number
}

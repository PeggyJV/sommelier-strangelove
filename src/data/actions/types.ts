import { Provider } from "@wagmi/core"
import BigNumber from "bignumber.js"
import { Contract } from "ethers"

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

export interface DepositAndSwapParams {
  provider: Provider
  senderAddress: string
  payload: DepositAndSwapPayload
}

export type KnownCoingeckoAssetId =
  | "wrapped-bitcoin"
  | "weth"
  | "usd-coin"

export interface PriceData {
  date: number
  change: number
  value: number
}

export type GetAssetGainChartDataProps = {
  day: number
  interval: "hourly" | "daily"
  firstDate?: Date
}

export interface StrategyContracts {
  cellarContract: Contract
  cellarSigner: Contract
  stakerContract?: Contract
  stakerSigner?: Contract
  cellarRouterSigner: Contract
}
export type AllContracts = Record<string, StrategyContracts>

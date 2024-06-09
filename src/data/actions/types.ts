import { Provider } from "@wagmi/core"
import { Contract } from "ethers"
import { getAllStrategiesData } from "./common/getAllStrategiesData"
import { getStrategyData } from "./common/getStrategyData"

export interface UserStake {
  amount: bigint
  amountWithBoost: bigint
  rewardPerTokenPaid: bigint
  rewards: bigint
  unbondTimestamp: number
  lock: number
}
export interface StakerUserData {
  claimAllRewards: bigint[]
  claimAllRewardsUSD: number
  totalBondedAmount: {
    value: bigint
    formatted: string
  }
  totalClaimAllRewards: {
    value: bigint
    formatted: string
  }
  totalRewards: bigint
  userStakes: UserStake[]
}

export interface StakerData {
  rewardRate: bigint
  potentialStakingApy: bigint
}

export interface CellarData {
  activeAsset: string
  name: string
  maxLocked: bigint
  accrualPeriod: bigint
  totalAssets: bigint
  apy: bigint
}

export interface CellarUserData {
  maxDeposit: bigint
  maxWithdraw: bigint
  netValue: bigint
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
  chain: string
}
export type AllContracts = Record<string, StrategyContracts>

export type AllStrategiesData = Awaited<
  ReturnType<typeof getAllStrategiesData>
>

export type StrategyData = Awaited<ReturnType<typeof getStrategyData>>

export type GetAllTimeShareValueQuery = {
  __typename?: "Query" | undefined
  cellar?:
    | {
        __typename?: "Cellar" | undefined
        dayDatas: Array<{
          __typename?: "CellarDayData"
          date: number
          shareValue: string
        }>
      }
    | null
    | undefined
}

export type GetMonthlyShareValueQuery = {
  __typename?: "Query" | undefined
  cellar?:
    | {
        __typename?: "Cellar" | undefined
        dayDatas: Array<{
          __typename?: "CellarDayData"
          date: number
          shareValue: string
        }>
      }
    | null
    | undefined
}

export type GetWeeklyShareValueQuery = {
  __typename?: "Query" | undefined
  cellar?:
    | {
        __typename?: "Cellar" | undefined
        dayDatas: Array<{
          __typename?: "CellarDayData"
          date: number
          shareValue: string
        }>
      }
    | null
    | undefined
}

export type GetHourlyShareValueQuery = {
  __typename?: "Query" | undefined
  cellarHourDatas: Array<{
    __typename?: "CellarHourData"
    date: number
    shareValue: string
  }>
}

export type GetStrategyDataQuery = {
  __typename?: "Query"
  cellar?: {
    __typename?: "Cellar"
    id: string
    tvlTotal: string
    shareValue: string
    dayDatas: Array<{
      __typename?: "CellarDayData"
      date: number
      shareValue: string
    }>
  } | null
}

export type GetAllStrategiesDataQuery = {
  __typename?: "Query"
  cellars: Array<{
    __typename?: "Cellar"
    id: string
    tvlTotal: string
    shareValue: string
    dayDatas: Array<{
      __typename?: "CellarDayData"
      date: number
      shareValue: string
    }>
    chain: string
  }>
}

export type GetTVLDataQuery = {
  [address: string]: number;
  'total_tvl': number;
}

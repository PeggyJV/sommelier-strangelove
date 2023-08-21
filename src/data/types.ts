import { IconProps } from "@chakra-ui/react"
import { VFC } from "react"

export enum StakerKey {
  CELLAR_STAKING_V0815 = "CELLAR_STAKING_V0815",
  CELLAR_STAKING_V0821 = "CELLAR_STAKING_V0821",
}
export enum CellarKey {
  CELLAR_V0815 = "CELLAR_V0815",
  CELLAR_V0816 = "CELLAR_V0816",
  CELLAR_V2 = "CELLAR_V2",
  CELLAR_V2PT5 = "CELLAR_V2PT5",
}
export enum CellarRouterKey {
  CELLAR_ROUTER_V0815 = "CELLAR_ROUTER_V0815",
  CELLAR_ROUTER_V0816 = "CELLAR_ROUTER_V0816",
}

export enum CellarNameKey {
  AAVE = "AAVE",
  ETH_BTC_MOM = "ETH_BTC_MOM",
  ETH_BTC_TREND = "ETH_BTC_TREND",
  STEADY_ETH = "STEADY_ETH",
  STEADY_BTC = "STEADY_BTC",
  STEADY_UNI = "STEADY_UNI",
  STEADY_MATIC = "STEADY_MATIC",
  REAL_YIELD_USD = "REAL_YIELD_USD",
  REAL_YIELD_ETH = "REAL_YIELD_ETH",
  REAL_YIELD_BTC = "REAL_YIELD_BTC",
  DEFI_STARS = "DEFI_STARS",
  REAL_YIELD_LINK = "REAL_YIELD_LINK",
  REAL_YIELD_1INCH = "REALY_YIELD_1INCH",
  REAL_YIELD_ENS = "REAY_YIELD_ENS",
  REAL_YIELD_SNX = "REAL_YIELD_SNX",
  REAL_YIELD_UNI = "REAL_YIELD_UNI",
  FRAXIMAL = "FRAXIMAL",
  TURBO_SWETH = "TURBO_SWETH",
}

export interface ConfigProps {
  id: string
  baseApy?: number
  cellarNameKey: CellarNameKey
  noSubgraph?: boolean
  lpToken: {
    address: string
    imagePath: string
  }
  cellarRouter: {
    address: string
    abi: readonly {}[]
    key: CellarRouterKey
  }
  cellar: {
    address: string
    abi: readonly {}[]
    key: CellarKey
  }
  // staker optional because there will be a cellar without staker contract
  staker?: {
    address: string
    abi: readonly {}[]
    key: StakerKey
  }
  rewardTokenAddress?: string
  customRewardWithoutAPY?: CustomRewardWithoutAPY
}

export enum CellarType {
  automatedPortfolio,
  yieldStrategies,
}

type Exchange =
  | {
      name: string
      url: string
      logo: string
    }
  | {
      name: string
      logo: string
    }

export interface CustomRewardWithoutAPY {
  tokenSymbol: string
  tokenDisplayName: string
  tokenAddress: string
  imagePath: string
  customRewardMessageTooltip?: string
  customRewardMessage?: string
  customRewardHeader?: string
  showRewards?: boolean
  showClaim?: boolean
  customRewardAPYTooltip?: string
  logo?: VFC<IconProps> 
  logoSize?: string
}

export interface CellarData {
  isContractNotReady?: boolean
  deprecated?: boolean
  name: string
  slug: string
  dashboard: string
  popUpTitle?: string
  popUpDescription?: string
  tradedAssets?: string[]
  exchanges?: Exchange[]
  launchDate?: Date
  stakingLaunchDate?: Date
  cellarType: CellarType
  description: string
  strategyType: string
  strategyTypeTooltip?: string
  startingShareValue?: string
  managementFee: string
  managementFeeTooltip?: string
  protocols: string | string[]
  strategyAssets: string[]
  performanceSplit: {
    [key: string]: number
  }
  strategyBreakdown: {
    [key: string]: string
  }
  strategyProvider?: {
    logo?: string
    title?: string
    href?: string
    tooltip?: string
  }
  depositTokens: {
    list: string[]
  }
  overrideApy?: {
    [key: string]: string
  }
  config: ConfigProps
  faq?: {
    question: string
    answer: string
  }[]
}
export interface CellarDataMap {
  [key: string]: CellarData
}

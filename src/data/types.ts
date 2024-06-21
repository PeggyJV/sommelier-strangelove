import { IconProps } from "@chakra-ui/react"
import { VFC } from "react"
import { Token } from "src/data/tokenConfig"
import { Chain } from "data/chainConfig"
import { Abi } from "viem"

export enum StakerKey {
  CELLAR_STAKING_V0815 = "CELLAR_STAKING_V0815",
  CELLAR_STAKING_V0821 = "CELLAR_STAKING_V0821",
}
export enum CellarKey {
  CELLAR_V0815 = "CELLAR_V0815",
  CELLAR_V0816 = "CELLAR_V0816",
  CELLAR_V2 = "CELLAR_V2",
  CELLAR_V2PT5 = "CELLAR_V2PT5",
  CELLAR_V2PT6 = "CELLAR_V2PT6",
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
  ETH_TREND_GROWTH = "ETH_TREND_GROWTH",
  TURBO_GHO = "TURBO_GHO",
  TURBO_STETH = "TURBO_STETH",
  TEST_ARBITRUM_REAL_YIELD_USD = "TEST_ARBITRUM_REAL_YIELD_USD",
  TEST_ARBITRUM_MULTI_ASSET_DEPOSIT = "TEST_ARBITRUM_MULTI_ASSET_DEPOSIT",
  TURBO_STETH_STETH_DEPOSIT = "TURBO_STETH_STETH_DEPOSIT",
  TURBO_SOMM = "TURBO_SOMM",
  TURBO_EETH = "TURBO_EETH",
  REAL_YIELD_ETH_ARB = "REAL_YIELD_ETH_ARB",
  MORPHO_ETH = "MORPHO_ETH",
  TURBO_DIVETH = "TURBO_DIVETH",
  TURBO_ETHX = "TURBO_ETHX",
  TURBO_EETHV2 = "TURBO_EETHV2",
  REAL_YIELD_USD_ARB = "REAL_YIELD_USD_ARB",
  TURBO_RSETH = "TURBO_RSETH",
  REAL_YIELD_ETH_OPT = "REAL_YIELD_ETH_OPT",
  TURBO_EZETH = "TURBO_EZETH",
  REAL_YIELD_ETH_SCROLL = "REAL_YIELD_ETH_SCROLL",

}

export interface Badge {
  customStrategyHighlight: string
  customStrategyHighlightColor?: string
}

export interface ConfigProps {
  id: string
  baseApy?: number
  cellarNameKey: CellarNameKey
  isNoDataSource?: boolean
  lpToken: {
    address: string
    imagePath: string
  }
  cellarRouter: {
    address: string
    abi: Abi
    key: CellarRouterKey
  }
  cellar: {
    address: string
    abi: Abi
    key: CellarKey
    decimals: number
  }
  // staker optional because there will be a cellar without staker contract
  staker?: {
    address: string
    abi: Abi
    key: StakerKey
  }
  customReward?: CustomReward
  badges?: Badge[]
  baseAsset: Token
  feePromotion?: string
  show7DayAPYTooltip?: boolean
  chain: Chain
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

export interface CustomReward {
  showOnlyBaseApy?: boolean
  showAPY: boolean
  tokenSymbol: string
  tokenDisplayName: string
  tokenAddress: string
  imagePath: string
  customRewardMessageTooltip?: string
  customRewardMessage?: string
  customRewardHeader?: string
  showBondingRewards?: boolean
  showClaim?: boolean
  customClaimMsg?: string
  customRewardAPYTooltip?: string
  logo?: VFC<IconProps>
  logoSize?: string
  customRewardLongMessage?: string
  rewardHyperLink?: string
  customColumnHeader?: string
  customColumnHeaderToolTip?: string
  customColumnValue?: string
  stakingDurationOverride?: Date
  showSommRewards?: boolean
  customIconToolTipMsg?: string
  customRewardEndMessage?: string
  customSommRewardsEndMessage?: string
}

export interface CellarData {
  isContractNotReady?: boolean
  deprecated?: boolean
  name: string
  slug: string
  dashboard: string
  popUpTitle?: string
  popUpDescription?: string
  tradedAssets: string[]
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

export interface CellarAddressDataMap {
  [key: string]: CellarData
}

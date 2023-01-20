export enum StakerKey {
  CELLAR_STAKING_V0815 = "CELLAR_STAKING_V0815",
}
export enum CellarKey {
  CELLAR_V0815 = "CELLAR_V0815",
  CELLAR_V0816 = "CELLAR_V0816",
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
}

export interface ConfigProps {
  id: string
  cellarNameKey: CellarNameKey
  lpToken: {
    address: string
    imagePath: string
  }
  cellarRouter: {
    address: string
    abi: unknown
    key: CellarRouterKey
  }
  cellar: {
    address: string
    abi: unknown
    key: CellarKey
  }
  // staker optional because there will be a cellar without staker contract
  staker?: {
    address: string
    abi: unknown
    key: StakerKey
  }
  rewardTokenAddress?: string
}

export enum CellarType {
  automatedPortfolio,
  yieldStrategies,
}
export interface CellarDataMap {
  [key: string]: {
    name: string
    launchDate?: Date
    cellarType: CellarType
    description: string
    strategyType: string
    strategyTypeTooltip?: string
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
    overrideApy?: {
      title: string
      value: string
      tooltip: string
    }
    depositTokens: {
      list: string[]
    }
    config: ConfigProps
    faq?: {
      question: string
      answer: string
    }[]
  }
}

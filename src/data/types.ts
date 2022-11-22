export enum StakerKey {
  AAVE_STAKER = "AAVE_STAKER",
}
export enum CellarKey {
  AAVE_V2_STABLE_CELLAR = "AAVE_V2_STABLE_CELLAR",
  CLEAR_GATE_CELLAR = "CLEARGATE_CELLAR",
  PATACHE_LINK = "PATACHE_LINK",
}
export enum CellarRouterKey {
  CELLAR_ROUTER = "CELLAR_ROUTER",
  CLEAR_GATE_ROUTER = "CLEAR_GATE_ROUTER",
}

export interface ConfigProps {
  id: string
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
    launchDate?: string
    cellarType: CellarType
    description: string
    strategyType: string
    strategyTypeTooltip?: string
    managementFee: string
    managementFeeTooltip?: string
    protocols: string
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

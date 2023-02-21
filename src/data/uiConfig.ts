import { CellarKey, CellarNameKey, ConfigProps } from "./types"

interface BondingPeriod {
  title: string
  amount: string
  value: BondingValueOptions
  checked?: boolean
}

type BondingValueOptions = 0 | 1 | 2

export const isBondingEnabled = (config: ConfigProps) => {
  return true
}

export const isBondButtonEnabled = (config: ConfigProps) => {
  return true
}

export const isRewardsEnabled = (config: ConfigProps) => {
  return true
}

export const isTokenAssets = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const intervalGainTimeline = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  ) {
    return "monthly"
  }
  return "weekly"
}

export const depositAssetDefaultValue = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  ) {
    return "USDT"
  }
  return "USDC"
}

export const isCurrentDepositsEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isActiveTokenStrategyEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isTVMEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isAPYEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isRewardAPYEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isTokenPriceEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC
  )
}

export const isDailyChangeEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC
  )
}

export const isIntervalGainPctEnabled = (config: ConfigProps) => {
  return false
  // return (
  //   config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
  //   config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
  //   config.cellarNameKey === CellarNameKey.STEADY_BTC ||
  //   config.cellarNameKey === CellarNameKey.STEADY_ETH ||
  //   config.cellarNameKey === CellarNameKey.STEADY_UNI ||
  //   config.cellarNameKey === CellarNameKey.STEADY_MATIC
  // )
}

export const lpTokenTooltipContent = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
    return "Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
    return "The LP tokens represent a user's share of the pool and can always be redeemed for the original tokens"
  return ""
}

export const intervalGainPctTitleContent = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
    return "1W Change vs USDC"
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
    return "1M Change vs USDC"
  return ""
}

export const intervalGainPctTooltipContent = (
  config: ConfigProps
) => {
  return ""
  // if (
  //   config.cellarNameKey === CellarNameKey.STEADY_BTC ||
  //   config.cellarNameKey === CellarNameKey.STEADY_ETH ||
  //   config.cellarNameKey === CellarNameKey.STEADY_UNI ||
  //   config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
  //   config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  // )
  //   return `% change of token price compared to a benchmark portfolio of USDC`
  // if (
  //   config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
  //   config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  // )
  //   return `% change of token price compared to a benchmark portfolio of USDC`
  // // if (
  // //   config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
  // //   config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  // // )
  // //   return `% change of token price compared to a benchmark portfolio of 50% ETH and 50% BTC`
  // return ""
}

export const tokenPriceTooltipContent = (config: ConfigProps) => {
  if (config.cellarNameKey === CellarNameKey.STEADY_ETH)
    return "The dollar value of the ETH and USDC that 1 token can be redeemed"
  if (config.cellarNameKey === CellarNameKey.STEADY_BTC)
    return "The dollar value of the BTC and USDC that 1 token can be redeemed"
  if (config.cellarNameKey === CellarNameKey.STEADY_UNI)
    return "The dollar value of the UNI and USDC that 1 token can be redeemed"
  if (config.cellarNameKey === CellarNameKey.STEADY_MATIC)
    return "The dollar value of the MATIC and USDC that 1 token can be redeemed"
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
    return `The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for`
  return ""
}

export const isEthBtcChartEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
}

export const isUsdcChartEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isTokenPriceChartEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
}

export const isApyChartEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.CELLAR_V2
}

export const bondingPeriodOptions = (
  config: ConfigProps
): BondingPeriod[] => {
  if (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  ) {
    return [
      {
        title: "7D",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14D",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21D",
        amount: "1.5x SOMM",
        value: 2,
      },
    ]
  }
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  ) {
    return [
      {
        title: "10 Days",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Days",
        amount: "1.2x SOMM",
        value: 1,
      },
      {
        title: "20 Days",
        amount: "1.25x SOMM",
        value: 2,
      },
    ]
  }
  if (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC
  ) {
    return [
      {
        title: "10 Days",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Days",
        amount: "1.2x SOMM",
        value: 1,
      },
      {
        title: "20 Days",
        amount: "1.25x SOMM",
        value: 2,
      },
    ]
  }
  return []
}

export const isAssetDistributionEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC
    // From subgraph Real yield usd returning empty array, so disabling for now.
    // ||
    // config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isWithdrawTokenPriceEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC
  )
}

export const isUseBigBacktestingModal = (config: ConfigProps) => {
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_USD) {
    return "6xl"
  }
  return "2xl"
}

export const apyLabel = (config: ConfigProps) => {
  if (config.cellar.key === CellarKey.CELLAR_V2) {
    return "APY since inception"
  }
  return "Base APY"
}

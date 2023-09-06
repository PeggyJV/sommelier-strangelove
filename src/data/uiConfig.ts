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
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
  ) {
    return "USDT"
  }
  return "USDC"
}

export const isBondedDisabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_LINK ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI
  )
}

export const isCurrentDepositsEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
  )
}

export const isActiveTokenStrategyEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD
  )
}

export const isAPYEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_LINK ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_BTC ||
    config.cellarNameKey === CellarNameKey.FRAXIMAL ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH
  )
}

export const isRewardAPYEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isTokenPriceEnabledApp = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_BTC ||
    config.cellarNameKey === CellarNameKey.FRAXIMAL ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_LINK ||
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH
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

export const showTokenPriceInsteadOfApy = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_LINK
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

export const lpTokenTooltipContent = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
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
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
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
  if (config.cellarNameKey === CellarNameKey.DEFI_STARS)
    return "The dollar value of the COMP, CRV, LDO, MKR, AAVE and USDC that 1 token can be redeemed for"

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
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
  )
}

export const isTokenPriceChartEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.DEFI_STARS
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
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_BTC
  ) {
    return [
      {
        title: "7 Days",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Days",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21 Days",
        amount: "1.5x SOMM",
        value: 2,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.FRAXIMAL) {
    return [
      {
        title: "5 Days",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "10 Days",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "14 Days",
        amount: "1.5x SOMM",
        value: 2,
      },
    ]
  }
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.DEFI_STARS
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
  if (config.cellarNameKey === CellarNameKey.TURBO_SWETH) {
    return [
      {
        title: "14 Days",
        amount: "Up to 12 PEARL per swETH daily + SOMM Rewards",
        value: 0,
      },
    ]
  }

  return []
}

export const isUseBigBacktestingModal = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH
  ) {
    return "6xl"
  }
  return "2xl"
}

export const apyLabel = (config: ConfigProps) => {
  if (
    config.cellar.key !== CellarKey.CELLAR_V0815 &&
    config.cellar.key !== CellarKey.CELLAR_V0816
  ) {
    if (
      config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
      config.cellarNameKey === CellarNameKey.TURBO_SWETH
    ) {
      return "Estimated APY"
    }
    return "APY since inception"
  }
  return "Base APY"
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const apyHoverLabel = (config: ConfigProps) => {
  if (
    config.cellar.key !== CellarKey.CELLAR_V0815 &&
    config.cellar.key !== CellarKey.CELLAR_V0816
  ) {
    if (
      config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
      config.cellarNameKey === CellarNameKey.TURBO_SWETH
    ) {
      return "Estimated APY"
    }
    return "APY since inception"
  }
  return "Base APY"
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const baseApyHoverLabel = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH
  ) {
    return "Estimated APY"
  }
  return "Base APY"
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const isEstimatedApyEnable = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH
  ) {
    return true
  }
  return false
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const apyChartLabel = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH
  ) {
    return "Estimated APY"
  }
  return "Moving Average APY"
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const estimatedApyValue = (config: ConfigProps) => {
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH) {
    return {
      value: 1.6,
      formatted: "1.60%",
    }
  }
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX) {
    return {
      value: 3.7,
      formatted: "3.70%",
    }
  }
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI) {
    return {
      value: 2.6,
      formatted: "2.60%",
    }
  }
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS) {
    return {
      value: 1.9,
      formatted: "1.90%",
    }
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_SWETH) {
    return {
      value: 5.0,
      formatted: "5.0%",
    }
  }
}

export const showNetValueInAsset = (config: ConfigProps) => {
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH) {
    return true
  }
  return false
}

export const waitTime = (config: ConfigProps) => {
  if (config.cellarNameKey === CellarNameKey.REAL_YIELD_USD) {
    return "24 hours"
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_SWETH) {
    return null // No wait time
  }
  return "10 min"
}

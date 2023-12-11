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
    config.cellarNameKey === CellarNameKey.TURBO_SOMM ||
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
    config.cellarNameKey === CellarNameKey.TURBO_SWETH ||
    config.cellarNameKey === CellarNameKey.TURBO_GHO ||
    config.cellarNameKey === CellarNameKey.TURBO_SOMM ||
    config.cellarNameKey === CellarNameKey.TURBO_EETH ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH
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
    config.cellarNameKey === CellarNameKey.TURBO_SWETH ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH ||
    config.cellarNameKey ===
      CellarNameKey.TURBO_STETH_STETH_DEPOSIT ||
    config.cellarNameKey === CellarNameKey.TURBO_SOMM ||
    config.cellarNameKey === CellarNameKey.TURBO_EETH ||
    config.cellarNameKey === CellarNameKey.TURBO_GHO
  )
}

export const isTokenPriceEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH ||
    config.cellarNameKey === CellarNameKey.STEADY_UNI ||
    config.cellarNameKey === CellarNameKey.STEADY_MATIC ||
    config.cellarNameKey === CellarNameKey.ETH_TREND_GROWTH
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
    config.cellarNameKey === CellarNameKey.TURBO_SWETH ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH ||
    config.cellarNameKey ===
      CellarNameKey.TURBO_STETH_STETH_DEPOSIT ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ETH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_BTC
  )
    return "Unbonded LP tokens earn yield from the vault but do not earn liquidity mining rewards"
  else
    return "The LP tokens represent a user's share of the pool and can always be redeemed for the original tokens"
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
  if (config.cellarNameKey === CellarNameKey.ETH_TREND_GROWTH)
    return "The dollar value that 1 token can be redeemed for"

  return ""
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
    // ! Enable a bit post launch
    //config.cellarNameKey === CellarNameKey.ETH_TREND_GROWTH
  )
}

export const isApyChartEnabled = (config: ConfigProps) => {
  return (
    config.cellar.key === CellarKey.CELLAR_V2 ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH ||
    config.cellarNameKey === CellarNameKey.TURBO_GHO
  )
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
        title: "7 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21 Day Unbonding",
        amount: "1.5x SOMM",
        value: 2,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.FRAXIMAL) {
    return [
      {
        title: "5 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "10 Day Unbonding",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "14 Day Unbonding",
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
        title: "10 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.2x SOMM",
        value: 1,
      },
      {
        title: "20 Day Unbonding",
        amount: "1.25x SOMM",
        value: 2,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.ETH_TREND_GROWTH) {
    return [
      {
        title: "7 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21 Day Unbonding",
        amount: "1.5x SOMM",
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
        title: "10 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.2x SOMM",
        value: 1,
      },
      {
        title: "20 Day Unbonding",
        amount: "1.25x SOMM",
        value: 2,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_SWETH) {
    return [
      {
        title: "14 Day Unbonding",
        amount: "Up to 12 PEARL per swETH daily + SOMM Rewards",
        value: 0,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_GHO) {
    return [
      {
        title: "7 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21 Day Unbonding",
        amount: "1.5x SOMM",
        value: 2,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_SOMM) {
    return [
      {
        title: "7 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21 Day Unbonding",
        amount: "1.5x SOMM",
        value: 2,
      },
    ]
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_EETH) {
    return [
      {
        title: "7 Day Unbonding",
        amount: "1.1x SOMM",
        value: 0,
      },
      {
        title: "14 Day Unbonding",
        amount: "1.3x SOMM",
        value: 1,
      },
      {
        title: "21 Day Unbonding",
        amount: "1.5x SOMM",
        value: 2,
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
    (config.cellar.key !== CellarKey.CELLAR_V0815 &&
      config.cellar.key !== CellarKey.CELLAR_V0816) ||
    config.cellarNameKey === CellarNameKey.TURBO_SWETH
  ) {
    if (
      config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
      config.cellarNameKey === CellarNameKey.TURBO_EETH ||
      config.cellarNameKey === CellarNameKey.TURBO_SOMM ||
      config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
    ) {
      return "Estimated APY"
    }
    return "Net APY"
  }
  return "Net APY"
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
      config.cellarNameKey === CellarNameKey.TURBO_EETH ||
      config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
      config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
    ) {
      return "Estimated APY"
    } /*else if (config.cellarNameKey === CellarNameKey.TURBO_SWETH) {
      return "7 Day MA APY (includes swETH incentives)"
    } */ else if (config.cellarNameKey === CellarNameKey.TURBO_SOMM) {
      return "Estimated Reward APY (excluding impermanent loss)"
    }
    return "30D MA APY"
  }
  return "30D MA APY"
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const baseApyHoverLabel = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.TURBO_EETH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
  ) {
    return "Estimated APY"
  } /*else if (config.cellarNameKey === CellarNameKey.TURBO_SWETH) {
    return "7 Day MA APY (includes swETH incentives)"
  } */ else if (config.cellarNameKey === CellarNameKey.TURBO_SOMM) {
    return "Estimated Reward APY (excluding impermanent loss)"
  }
  return "30D MA APY"
}

// TODO: UPDATE THIS FUNCTION, WEHN THE APY IS AVAILABLE
export const isEstimatedApyEnable = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.REAL_YIELD_1INCH ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_ENS ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_SNX ||
    config.cellarNameKey === CellarNameKey.REAL_YIELD_UNI ||
    config.cellarNameKey === CellarNameKey.TURBO_EETH ||
    config.cellarNameKey === CellarNameKey.TURBO_SOMM ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
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
    config.cellarNameKey === CellarNameKey.TURBO_EETH ||
    config.cellarNameKey === CellarNameKey.TURBO_SOMM ||
    config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
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
  if (config.cellarNameKey === CellarNameKey.TURBO_SOMM) {
    return {
      value: 60.0,
      formatted: "60.0%",
    }
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_EETH) {
    return {
      value: 6.0,
      formatted: "6.0%",
    }
  }
  if (
    config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
  ) {
    return {
      value: 10.0,
      formatted: "10.0%",
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
  if (config.cellarNameKey === CellarNameKey.TURBO_GHO) {
    return null // No wait time
  }
  if (config.cellarNameKey === CellarNameKey.TURBO_STETH) {
    return null // No wait time
  }
  if (
    config.cellarNameKey === CellarNameKey.TURBO_STETH_STETH_DEPOSIT
  ) {
    return null // No wait time
  }
  return "10 min"
}

import { CellarNameKey, ConfigProps } from "./types"

export const isBondingEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isBondButtonEnabled = (config: ConfigProps) => {
  // aave bond button disabled because program already ended
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isRewardsEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isTokenAssets = (config: ConfigProps) => {
  return config.cellarNameKey === CellarNameKey.AAVE
}

export const isPositionTokenAssets = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isCurrentDepositsEnabled = (config: ConfigProps) => {
  return config.cellarNameKey === CellarNameKey.AAVE
}

export const isCountdownEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isActiveTokenStrategyEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.AAVE ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isTVMEnabled = (config: ConfigProps) => {
  return config.cellarNameKey === CellarNameKey.AAVE
}

export const isAPYEnabled = (config: ConfigProps) => {
  return config.cellarNameKey === CellarNameKey.AAVE
}

export const isTokenPriceEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isDailyChangeEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const isIntervalGainPctEnabled = (config: ConfigProps) => {
  return (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND ||
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

export const lpTokenTooltipContent = (config: ConfigProps) => {
  if (config.cellarNameKey === CellarNameKey.AAVE)
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
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
    return "1W Change vs USDC"
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
    return "1W Change vs ETH/BTC 50/50"
  return ""
}

export const intervalGainPctTooltipContent = (
  config: ConfigProps
) => {
  if (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
    return `% change of token price compared to a benchmark portfolio of USDC`
  if (
    config.cellarNameKey === CellarNameKey.ETH_BTC_MOM ||
    config.cellarNameKey === CellarNameKey.ETH_BTC_TREND
  )
    return `% change of token price compared to a benchmark portfolio of 50% ETH and 50% BTC`
  return ""
}

export const tokenPriceTooltipContent = (config: ConfigProps) => {
  if (
    config.cellarNameKey === CellarNameKey.STEADY_BTC ||
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
    return ""
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
    config.cellarNameKey === CellarNameKey.STEADY_ETH
  )
}

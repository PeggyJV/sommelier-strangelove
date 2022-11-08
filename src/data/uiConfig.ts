import { CellarKey, ConfigProps } from "./types"

export const isBondingEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

export const isRewardsEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

export const isCurrentDepositsEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

export const isActiveTokenStrategyEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

export const isTVMEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

export const isAPYEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR
}

export const isTokenPriceEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
}

export const isDailyChangeEnabled = (config: ConfigProps) => {
  return config.cellar.key === CellarKey.CLEAR_GATE_CELLAR
}

export const lpTokenTooltipContent = (config: ConfigProps) => {
  if (config.cellar.key === CellarKey.AAVE_V2_STABLE_CELLAR)
    return "Unbonded LP tokens earn interest from strategy but do not earn Liquidity Mining rewards"
  if (config.cellar.key === CellarKey.CLEAR_GATE_CELLAR)
    return "The LP tokens represent a user's share of the pool and can always be redeemed for the original tokens"
  return ""
}

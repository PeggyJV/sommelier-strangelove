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

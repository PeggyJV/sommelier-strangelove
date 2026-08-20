import { config as utilConfig } from "utils/config"

/**
 * Vaults whose redemptions currently revert on-chain.
 *
 * Turbo stETH's ERC4626 share price oracle stopped receiving updates, so
 * `Cellar.totalAssets()` reverts with `Cellar__OracleFailure()`. Real Yield ETH
 * holds a Turbo stETH position, so the same revert propagates through its
 * accounting. Until the oracle is replaced, `redeem`/`withdraw` revert for
 * every holder of either vault.
 *
 * Single source of truth so the vault page and the legacy-vaults banner cannot
 * drift apart.
 */
export const WITHDRAWALS_PAUSED_SLUGS: readonly string[] = [
  utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG,
  utilConfig.CONTRACT.TURBO_STETH.SLUG,
]

export const isWithdrawalsPaused = (slug?: string): boolean =>
  !!slug && WITHDRAWALS_PAUSED_SLUGS.includes(slug)

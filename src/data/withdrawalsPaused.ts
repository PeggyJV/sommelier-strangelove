import { config as utilConfig } from "utils/config"

/**
 * Vaults whose redemptions currently revert on-chain.
 *
 * Vaults undergoing recovery are kept on this watch list until a live
 * `previewRedeem` call succeeds. This covers both oracle failures and vaults
 * such as Real Yield USD whose positions must be made liquid before users can
 * redeem safely.
 *
 * Single source of truth so the vault page and the legacy-vaults banner cannot
 * drift apart.
 */
export const WITHDRAWALS_PAUSED_SLUGS: readonly string[] = [
  utilConfig.CONTRACT.REAL_YIELD_USD_ARB.SLUG,
  utilConfig.CONTRACT.REAL_YIELD_ETH.SLUG,
  utilConfig.CONTRACT.REAL_YIELD_ETH_OPT.SLUG,
  utilConfig.CONTRACT.TURBO_STETH.SLUG,
]

export const isWithdrawalsPaused = (slug?: string): boolean =>
  !!slug && WITHDRAWALS_PAUSED_SLUGS.includes(slug)

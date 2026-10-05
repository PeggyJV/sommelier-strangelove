import { config } from "utils/config"

export type VaultInteractionMode =
  | "withdrawal-only"
  | "migration-only"

/**
 * The app is in wind-down mode: legacy vaults expose withdrawals, while
 * Alpha stETH only exposes the existing migration flow.
 */
export const getVaultInteractionMode = (
  slug?: string
): VaultInteractionMode =>
  slug === config.CONTRACT.ALPHA_STETH.SLUG
    ? "migration-only"
    : "withdrawal-only"

export const isOrdinaryDepositEnabled = (_slug?: string): boolean =>
  false

export const isOrdinaryWithdrawalEnabled = (slug?: string): boolean =>
  getVaultInteractionMode(slug) === "withdrawal-only"


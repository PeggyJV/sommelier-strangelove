import { parseMoneyString, coerceNetValue } from "./money"

export type Vault = {
  name?: string
  metrics?: { tvl?: number | null }
  user?: { netValue?: number | null }
}

type MainPageSortableVault = {
  name?: string
  tvl?: string | number | null
  netValue?: string | number | null
}

const normName = (s?: string) => (s ?? "").toLowerCase()

export function sortVaultsForMainPage<T extends MainPageSortableVault>(
  vaults: T[],
  opts: { connected: boolean }
): T[] {
  const byTVL = (v: T) => parseMoneyString(v.tvl)
  const byNV = (v: T) => coerceNetValue(v.netValue)

  // Debug logging for sorting
  if (process.env.NEXT_PUBLIC_DEBUG_SORT === "1") {
    console.log("Sorting vaults:", {
      connected: opts.connected,
      vaultCount: vaults.length,
      sampleVaults: vaults.slice(0, 3).map((v) => ({
        name: v.name,
        tvl: v.tvl,
        netValue: v.netValue,
        parsedTvl: byTVL(v),
        parsedNetValue: byNV(v),
      })),
    })
  }

  return [...vaults].sort((a, b) => {
    if (!opts.connected) return byTVL(b) - byTVL(a)
    const an = byNV(a),
      bn = byNV(b)
    if (Number.isFinite(an) && Number.isFinite(bn) && an !== bn)
      return bn - an
    // fallback TVL
    return byTVL(b) - byTVL(a)
  })
}

// Keep the original function for backward compatibility
export function sortVaults<T extends Vault>(
  list: T[],
  isConnected: boolean
): T[] {
  return [...list].sort((a, b) => {
    if (isConnected) {
      // When connected: Order by Net Value (highest to lowest), fallback to TVL
      const aNetValue = coerceNetValue(a.user?.netValue)
      const bNetValue = coerceNetValue(b.user?.netValue)

      // Compare net values first
      const nv = bNetValue - aNetValue
      if (nv !== 0) return nv

      // Fallback to TVL if net values are equal, 0, or missing
      const aTvl = parseMoneyString(a.metrics?.tvl)
      const bTvl = parseMoneyString(b.metrics?.tvl)
      const tvl = bTvl - aTvl
      if (tvl !== 0) return tvl
    } else {
      // When not connected: Order by TVL (highest to lowest)
      const aTvl = parseMoneyString(a.metrics?.tvl)
      const bTvl = parseMoneyString(b.metrics?.tvl)
      const tvl = bTvl - aTvl
      if (tvl !== 0) return tvl
    }

    // Final fallback: alphabetical by name
    const an = normName(a.name)
    const bn = normName(b.name)
    return an < bn ? -1 : an > bn ? 1 : 0
  })
}

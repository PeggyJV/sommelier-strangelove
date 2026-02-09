// Deterministic vault sorting selector
// Rules:
// - Disconnected: TVL desc; tie: name asc
// - Connected: Net Value desc, then TVL desc, then name asc
// - Net Value and TVL are normalized to numbers; undefined/NaN treated as 0
// - Equality checks use 1e-9 tolerance to avoid jitter

export type AnyVault = {
  name?: string
  tvl?: unknown
  netValue?: unknown
  tvm?: { value?: unknown }
  userStrategyData?: {
    userData?: {
      netValue?: { value?: unknown }
    }
  }
} & Record<string, unknown>

const toNum = (v: unknown): number => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0
  if (typeof v === "bigint") return Number(v)
  if (v == null) return 0
  const s = String(v).replace(/,/g, "").trim()
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

const eq = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9

const cmpByNameAsc = (a: { name?: string }, b: { name?: string }) =>
  (a.name || "").localeCompare(b.name || "")

const cmpDesc = (x: number, y: number) => y - x

function comparator(walletConnected: boolean) {
  return (
    a: { name?: string; tvl: number; netValue: number },
    b: { name?: string; tvl: number; netValue: number }
  ) => {
    const na = a.netValue
    const nb = b.netValue
    const ta = a.tvl
    const tb = b.tvl

    if (walletConnected) {
      const nvDelta = cmpDesc(na, nb)
      if (nvDelta !== 0 && !eq(na, nb)) return nvDelta
      const tvlDelta = cmpDesc(ta, tb)
      if (tvlDelta !== 0 && !eq(ta, tb)) return tvlDelta
      return cmpByNameAsc(a, b)
    }

    const tvlDelta = cmpDesc(ta, tb)
    if (tvlDelta !== 0 && !eq(ta, tb)) return tvlDelta
    return cmpByNameAsc(a, b)
  }
}

export function getSortedVaults(
  walletConnected: boolean,
  vaultsRaw: AnyVault[] | undefined
): AnyVault[] {
  if (!Array.isArray(vaultsRaw) || vaultsRaw.length === 0) return []

  // Normalize and preserve stability via index
  const normalized = vaultsRaw.map((v, index) => {
    const tvl = toNum(
      v?.tvm?.value ??
        (v?.tvl as { value?: unknown } | undefined)?.value ??
        v?.tvl
    )
    const netValue = toNum(
      v?.userStrategyData?.userData?.netValue?.value ??
        v?.netValue
    )
    return {
      ...v,
      name: v?.name ?? "",
      tvl,
      netValue,
      __index: index,
    }
  })

  const cmp = comparator(walletConnected)
  // Stable sort: compare indices on full equality
  const sorted = normalized.slice().sort((a, b) => {
    const r = cmp(a, b)
    if (r !== 0) return r
    return a.__index - b.__index
  })

  // Remove decoration
  return sorted.map(({ __index: _index, tvl: _tvl, netValue: _netValue, ...rest }) => rest)
}

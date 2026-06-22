import type { NextApiRequest, NextApiResponse } from "next"
import { cellarDataMap } from "data/cellarDataMap"
import { fetchCellarStrategyData } from "src/queries/get-all-strategies-data"

type MinimalVault = {
  id: string
  slug: string
  name: string
  chain: string
  tvl: { value: number; formatted: string }
  status: "active" | "withdrawals-only" | "paused"
  logoUrl?: string
  apr?: { value: number; formatted: string } | null
}

type AggregatedCellar = {
  id?: string
  tvlTotal?: number | string
}

type AggregatedResponse = {
  data?: {
    cellars?: AggregatedCellar[]
  }
}

type CellarMapEntry = {
  name?: string
  deprecated?: boolean
  config?: {
    chain?: { id?: string }
    cellar?: { address?: string }
    lpToken?: { imagePath?: string }
  }
}

// Temporary list of Somm-native slugs. Extend as more in-house vaults are added.
const SOMM_NATIVE_SLUGS = new Set<string>(["Alpha-stETH"])

// Live TVL endpoint, used as a fallback when a vault is missing from the
// aggregator. The aggregator only includes cellars present in the last month
// of dailyData, so a vault whose data collection has stalled drops out and its
// TVL would otherwise default to 0 even while it holds real value.
const LIVE_TVL_URL = "https://api.sommelier.finance/tvl"

// Fetch live per-cellar TVL keyed lowercase (keys are `address` on ethereum or
// `address-<chain>` on L2s). Never throws -- returns {} on any failure.
async function fetchLiveTvlByKey(): Promise<Record<string, number>> {
  try {
    const res = await fetch(LIVE_TVL_URL)
    if (!res.ok) return {}
    const json = await res.json()
    const resp = (json?.Response ?? {}) as Record<string, unknown>
    const out: Record<string, number> = {}
    for (const [k, v] of Object.entries(resp)) {
      if (k === "total_tvl") continue
      out[k.toLowerCase()] = Number(v) || 0
    }
    return out
  } catch {
    return {}
  }
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const [agg, liveTvlByKey] = await Promise.all([
      fetchCellarStrategyData() as Promise<AggregatedResponse>,
      fetchLiveTvlByKey(),
    ])

    // Map address->tvl from aggregator result (normalize keys to lowercase)
    const tvlByKey: Record<string, number> = {}
    for (const c of agg.data?.cellars ?? []) {
      // keys in aggregator are address or address-<chain>
      const key = String(c?.id ?? "").toLowerCase()
      tvlByKey[key] = Number(c.tvlTotal || 0)
    }

    const result: MinimalVault[] = []
    for (const [slug, data] of Object.entries(
      cellarDataMap as Record<string, CellarMapEntry>
    )) {
      if (!SOMM_NATIVE_SLUGS.has(slug)) continue

      const chainId = data?.config?.chain?.id
      const addr = data?.config?.cellar?.address?.toLowerCase?.()
      if (!chainId || !addr || !data?.name) continue
      const tvlKey =
        chainId === "ethereum" ? addr : `${addr}-${chainId}`
      // Prefer the aggregator value; fall back to live /tvl when the vault is
      // missing or zero there (e.g. its dailyData feed has stalled).
      const aggTvl = tvlByKey[tvlKey] ?? 0
      const tvlVal = aggTvl > 0 ? aggTvl : liveTvlByKey[tvlKey] ?? 0

      const tvl = {
        value: tvlVal,
        formatted: tvlVal.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      }

      const status: MinimalVault["status"] = data?.deprecated
        ? "paused"
        : "active"

      result.push({
        id: addr,
        slug,
        name: data?.name,
        chain: chainId,
        tvl,
        status,
        logoUrl: data?.config?.lpToken?.imagePath,
        apr: null,
      })
    }

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    )
    res.status(200).json({ data: result })
  } catch (e) {
    res.status(500).json({ error: "failed" })
  }
}

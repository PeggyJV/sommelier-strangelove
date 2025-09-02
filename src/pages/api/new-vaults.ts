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

// Temporary list of Somm-native slugs. Extend as more in-house vaults are added.
const SOMM_NATIVE_SLUGS = new Set<string>(["Alpha-stETH"])

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const agg = await fetchCellarStrategyData()

    // Map address->tvl from aggregator result (normalize keys to lowercase)
    const tvlByKey: Record<string, number> = {}
    for (const c of (agg?.data?.cellars ?? [])) {
      // keys in aggregator are address or address-<chain>
      const key = String(c?.id ?? "").toLowerCase()
      tvlByKey[key] = Number((c as any)?.tvlTotal || 0)
    }

    const result: MinimalVault[] = []
    for (const [slug, data] of Object.entries(cellarDataMap) as any) {
      if (!SOMM_NATIVE_SLUGS.has(slug)) continue

      const chainId = data?.config?.chain?.id
      const addr = data?.config?.cellar?.address?.toLowerCase?.()
      const tvlKey =
        chainId === "ethereum" ? addr : `${addr}-${chainId}`
      const tvlVal = tvlByKey[tvlKey] ?? 0

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

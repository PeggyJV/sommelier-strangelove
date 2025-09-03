export type MinimalVault = {
  id: string
  slug: string
  name: string
  chain: string
  tvl: { value: number; formatted: string }
  status: "active" | "withdrawals-only" | "paused"
  logoUrl?: string
  apr?: { value: number; formatted: string } | null
}
export async function getNewVaults(): Promise<MinimalVault[]> {
  // Fetch TVL directly from Sommelier API with RSC caching
  const tvlRes = await fetch("https://api.sommelier.finance/tvl", {
    next: { revalidate: 60 },
  })
  if (!tvlRes.ok) throw new Error("Failed to fetch new vaults")
  const tvlJson = await tvlRes.json()
  const tvlMap: Record<string, number> = tvlJson?.Response || {}
  // Minimal curated somm-native list to avoid importing client-leaning modules
  const curated = [
    {
      id: "0xef417fce1883c6653e7dc6af7c6f85ccde84aa09", // Alpha STETH
      slug: "Alpha-stETH",
      name: "Alpha STETH",
      chain: "ethereum",
      logoUrl: "/assets/icons/alpha-steth.png",
      deprecated: false,
    },
  ] as const

  const list: MinimalVault[] = curated.map((v) => {
    const key = v.chain === "ethereum" ? v.id : `${v.id}-${v.chain}`
    const tvlValue = Number(tvlMap[key] ?? 0)
    return {
      id: v.id,
      slug: v.slug,
      name: v.name,
      chain: v.chain,
      tvl: {
        value: tvlValue,
        formatted: tvlValue.toLocaleString(undefined, {
          maximumFractionDigits: 0,
        }),
      },
      status: v.deprecated ? "paused" : "active",
      logoUrl: v.logoUrl,
      apr: null,
    }
  })

  return list
}

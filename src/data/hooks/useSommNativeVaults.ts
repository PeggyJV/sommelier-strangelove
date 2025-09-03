import { useQuery } from "@tanstack/react-query"
import { chainConfig } from "src/data/chainConfig"

type ApiVault = {
  id: string
  slug: string
  name: string
  chain: string
  tvl: { value: number; formatted: string }
  status: "active" | "withdrawals-only" | "paused"
  logoUrl?: string
  apr?: { value: number; formatted: string } | null
}

export type SommNativeListItem = {
  name: string
  slug: string
  isSommNative: boolean
  provider: { title: string }
  tvm: { value: number; formatted: string }
  baseApySumRewards?: { value?: number; formatted?: string }
  config: {
    chain: { displayName: string; id: string; logoPath?: string }
    cellar: { address: string }
  }
}

export function useSommNativeVaults() {
  return useQuery<{ data: ApiVault[] }, Error, SommNativeListItem[]>({
    queryKey: ["USE_SOMM_NATIVE_VAULTS_MIN"],
    queryFn: async () => {
      const res = await fetch("/api/new-vaults")
      if (!res.ok)
        throw new Error("Failed to fetch somm native vaults")
      return res.json()
    },
    select: (resp) => {
      const items = resp?.data ?? []
      return items.map((v): SommNativeListItem => {
        const chain = chainConfig.find((c) => c.id === v.chain)
        return {
          name: v.name,
          slug: v.slug,
          isSommNative: true,
          provider: { title: "Somm Protocol" },
          tvm: { value: v.tvl.value, formatted: v.tvl.formatted },
          baseApySumRewards: v.apr
            ? { value: v.apr.value, formatted: v.apr.formatted }
            : undefined,
          config: {
            chain: {
              displayName: chain?.displayName || v.chain,
              id: v.chain,
              logoPath: chain?.logoPath,
            },
            cellar: { address: v.id },
          },
        }
      })
    },
    staleTime: 120_000,
    suspense: true,
  })
}

export type Vault = {
  name?: string
  metrics?: { tvl?: number | null }
  user?: { netValue?: number | null }
}

const toNumber = (n: number | null | undefined): number =>
  Number.isFinite(n as number) ? Number(n) : 0

const normName = (s?: string) => (s ?? "").toLowerCase()

export function sortVaults<T extends Vault>(
  list: T[],
  isConnected: boolean
): T[] {
  return [...list].sort((a, b) => {
    if (isConnected) {
      const nv = toNumber(b.user?.netValue) - toNumber(a.user?.netValue)
      if (nv) return nv
      const tvl = toNumber(b.metrics?.tvl) - toNumber(a.metrics?.tvl)
      if (tvl) return tvl
    } else {
      const tvl = toNumber(b.metrics?.tvl) - toNumber(a.metrics?.tvl)
      if (tvl) return tvl
    }
    const an = normName(a.name)
    const bn = normName(b.name)
    return an < bn ? -1 : an > bn ? 1 : 0
  })
}



export type CellarLiquidityState = {
  totalAssets: bigint
  totalAssetsWithdrawable: bigint
}

const getUrl = (cellarId: string) =>
  `/api/cellar-liquidity-state?cellarId=${cellarId}`

export const fetchCellarLiquidityState = async (
  cellarId: string
): Promise<CellarLiquidityState> => {
  const res = await fetch(getUrl(cellarId))
  if (!res.ok) {
    throw new Error(`Failed to fetch liquidity state: ${res.status}`)
  }
  const json = (await res.json()) as {
    totalAssets: string
    totalAssetsWithdrawable: string
  }
  return {
    totalAssets: BigInt(json.totalAssets),
    totalAssetsWithdrawable: BigInt(json.totalAssetsWithdrawable),
  }
}

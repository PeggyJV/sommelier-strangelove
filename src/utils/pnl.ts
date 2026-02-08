export type PnlResult = {
  value: number
  formatted: string
}

export const calculatePnlPercent = (
  currentValueUsd: number,
  costBasisUsd: number
): PnlResult | null => {
  if (!Number.isFinite(currentValueUsd) || !Number.isFinite(costBasisUsd)) {
    return null
  }
  if (costBasisUsd <= 0) {
    return null
  }

  const value = ((currentValueUsd - costBasisUsd) / costBasisUsd) * 100
  return {
    value,
    formatted: `${value.toFixed(2)}%`,
  }
}

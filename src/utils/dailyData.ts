import { DailyDataResponse } from "data/types"

/**
 * Extract the latest TVL from daily data entries for a given address.
 * Finds the entry with the highest unix_seconds and returns its TVL value.
 */
export const getLatestTvlFromDaily = (
  data: DailyDataResponse | undefined,
  addr: string
): number => {
  const entries = data?.Response?.[addr]
  if (!Array.isArray(entries) || entries.length === 0) return 0
  const latest = entries.reduce(
    (acc, cur) =>
      (cur?.unix_seconds ?? 0) > (acc?.unix_seconds ?? 0) ? cur : acc,
    entries[0]
  )
  const tvl = Number(latest?.tvl ?? 0)
  return Number.isFinite(tvl) ? tvl : 0
}

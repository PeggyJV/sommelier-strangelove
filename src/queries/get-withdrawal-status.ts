export type WithdrawalStatus = {
  cellarId: string
  paused: boolean
  reason: "not_watched" | "redeemable" | "reverts" | "probe_unavailable"
}

export const fetchWithdrawalStatus = async (
  cellarId: string
): Promise<WithdrawalStatus> => {
  const res = await fetch(
    `/api/withdrawal-status?cellarId=${encodeURIComponent(cellarId)}`
  )
  if (!res.ok) {
    throw new Error(`Failed to fetch withdrawal status: ${res.status}`)
  }
  return (await res.json()) as WithdrawalStatus
}

import { useQuery } from "@tanstack/react-query"
import { fetchWithdrawalStatus } from "queries/get-withdrawal-status"
import { isWithdrawalsPaused } from "data/withdrawalsPaused"

/**
 * Whether to warn that withdrawals are unavailable for this vault.
 *
 * The static list in `withdrawalsPaused` names vaults worth probing; the live
 * `previewRedeem` probe decides whether the warning still applies. That way the
 * banner clears itself the moment the underlying oracle is fixed, instead of
 * relying on someone remembering to ship a copy change.
 *
 * While the probe is in flight, or if it fails, fall back to the static list:
 * for a vault we already know is broken, a stale warning is safer than
 * implying it is withdrawable.
 */
export const useWithdrawalsPaused = (cellarId?: string): boolean => {
  const watched = isWithdrawalsPaused(cellarId)

  const { data } = useQuery({
    queryKey: ["WITHDRAWAL_STATUS", cellarId],
    queryFn: () => fetchWithdrawalStatus(cellarId!),
    enabled: watched && !!cellarId,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  })

  if (!watched) return false
  return data ? data.paused : true
}

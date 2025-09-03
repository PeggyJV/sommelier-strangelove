import { analytics } from "./analytics"

export const txDebugEnabled = (): boolean => {
  try {
    if (process.env.NEXT_PUBLIC_TX_DEBUG === "1") return true
    if (typeof window !== "undefined") {
      return localStorage.getItem("txDebug") === "1"
    }
  } catch {}
  return false
}

export const logTxDebug = (
  event: string,
  payload: Record<string, unknown>
) => {
  if (!txDebugEnabled()) return
  try {
    // Console
    // eslint-disable-next-line no-console
    console.debug(`[tx-debug] ${event}`, payload)
  } catch {}
  try {
    analytics.track(`tx.debug.${event}`, {
      ts: Date.now(),
      ...payload,
    })
  } catch {}
}

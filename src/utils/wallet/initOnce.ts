let __wc_inited = false

export function initWalletCoreOnce(init: () => void) {
  if (typeof window === "undefined") return
  if (__wc_inited) return
  __wc_inited = true
  try {
    init()
  } catch {
    // swallow to prevent crashing on hot reloads
  }
}

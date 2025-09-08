function getSessionId(): string {
  try {
    const k = "__somm_session"
    const v = localStorage.getItem(k)
    if (v) return v
    const n = crypto.randomUUID
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
    localStorage.setItem(k, n)
    return n
  } catch {
    return "unknown"
  }
}

export function patchGlobalEthereumForSubmittedCapture() {
  if (typeof window === "undefined") return
  const eth: any = (window as any).ethereum
  if (!eth || typeof eth.request !== "function" || eth.__sommWrapped)
    return

  const orig = eth.request.bind(eth)
  eth.request = async (args: any) => {
    const res = await orig(args)
    try {
      const method = args?.method
      if (
        method === "eth_sendTransaction" ||
        method === "eth_sendRawTransaction"
      ) {
        const txHash = typeof res === "string" ? res : res?.hash
        if (txHash) {
          // eslint-disable-next-line no-console
          console.debug("[attrib] submitted(global)", {
            method,
            txHash,
          })
          // POST to our ingest endpoint (fire-and-forget)
          const hexId = await eth
            .request({ method: "eth_chainId" })
            .catch(() => null)
          const chainId =
            typeof hexId === "string" && hexId.startsWith("0x")
              ? parseInt(hexId, 16)
              : typeof hexId === "number"
              ? hexId
              : undefined
          const body = {
            stage: "submitted",
            method,
            txHash: String(txHash).toLowerCase(),
            chainId,
            domain: location.hostname,
            pagePath: location.pathname,
            sessionId: getSessionId(),
            timestampMs: Date.now(),
          }
          fetch("/api/ingest-rpc", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(body),
            keepalive: false,
            credentials: "same-origin",
          }).catch(() => {})
        }
      }
    } catch {}
    return res
  }
  eth.__sommWrapped = true
}

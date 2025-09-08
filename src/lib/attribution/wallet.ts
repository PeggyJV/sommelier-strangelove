import type { Connector } from "wagmi"
import {
  buildAlphaStethRegistry,
  isAttributedAddress,
} from "./registry"

const registry = buildAlphaStethRegistry()

export function wrapConnector(connector: Connector): Connector {
  const origGetProvider = connector.getProvider?.bind(connector)
  if (!origGetProvider) return connector
  ;(connector as any).getProvider = async (...args: any[]) => {
    const provider: any = await origGetProvider(...args)
    if (!provider || typeof provider.request !== "function")
      return provider
    if (provider.__sommWrapped) return provider

    const orig = provider.request.bind(provider)

    provider.request = async (payload: any) => {
      const method = payload?.method
      const isSend =
        method === "eth_sendTransaction" ||
        method === "eth_sendRawTransaction"

      const res = await orig(payload)

      if (isSend) {
        try {
          const txHash =
            typeof res === "string"
              ? res
              : (res?.hash as string | undefined)
          if (txHash) {
            if (typeof window !== "undefined") {
              // eslint-disable-next-line no-console
              console.debug("[attrib] submitted", { method, txHash })
            }
            fetch("/api/ingest-rpc", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                events: [
                  {
                    stage: "submitted",
                    domain: window.location.hostname,
                    pagePath:
                      window.location.pathname +
                      window.location.search,
                    sessionId:
                      localStorage.getItem("somm_session_id") || "",
                    method,
                    txHash,
                    timestampMs: Date.now(),
                  },
                ],
              }),
              keepalive: true,
            }).catch(() => {})
          }
        } catch {}
      }
      return res
    }

    provider.__sommWrapped = true
    return provider
  }

  return connector
}

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
    if (
      provider &&
      typeof provider.request === "function" &&
      !provider.__sommWrapped
    ) {
      const orig = provider.request.bind(provider)
      provider.request = async (payload: any) => {
        try {
          const res = await orig(payload)
          if (
            payload?.method === "eth_sendTransaction" &&
            Array.isArray(payload?.params) &&
            payload.params[0]?.to
          ) {
            const to = String(payload.params[0].to)
            const match = isAttributedAddress(registry, to)
            if (match) {
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
                      method: payload.method,
                      to,
                      strategyKey: "ALPHA_STETH",
                      contractMatch: true,
                      timestampMs: Date.now(),
                    },
                  ],
                }),
                keepalive: true,
              })
            }
          }
          return res
        } catch (e) {
          throw e
        }
      }
      provider.__sommWrapped = true
    }
    return provider
  }

  return connector
}

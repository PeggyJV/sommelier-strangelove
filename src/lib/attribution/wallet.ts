import type { Connector } from "wagmi"
import {
  buildAlphaStethRegistry,
  isAttributedAddress,
} from "./registry"

const registry = buildAlphaStethRegistry()

type RpcPayload = {
  method?: string
  params?: Array<{ to?: string } | unknown>
}

type WrappedProvider = {
  request: (payload: RpcPayload) => Promise<unknown>
  __sommWrapped?: boolean
}

type ConnectorWithProvider = Connector & {
  getProvider?: (...args: unknown[]) => Promise<unknown>
}

export function wrapConnector(connector: Connector): Connector {
  const mutableConnector = connector as ConnectorWithProvider
  const origGetProvider = mutableConnector.getProvider?.bind(
    mutableConnector
  )
  if (!origGetProvider) return connector
  mutableConnector.getProvider = async (...args: unknown[]) => {
    const provider = (await origGetProvider(
      ...args
    )) as WrappedProvider | null
    if (
      provider &&
      typeof provider.request === "function" &&
      !provider.__sommWrapped
    ) {
      const orig = provider.request.bind(provider)
      provider.request = async (payload: RpcPayload) => {
        try {
          const res = await orig(payload)
          const firstParam =
            payload?.params?.[0] &&
            typeof payload.params[0] === "object"
              ? (payload.params[0] as { to?: string })
              : undefined
          if (
            payload?.method === "eth_sendTransaction" &&
            Array.isArray(payload?.params) &&
            firstParam?.to
          ) {
            const to = String(firstParam.to)
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

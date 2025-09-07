import type { Connector } from "wagmi"
import {
  buildAlphaStethRegistry,
  isAttributedAddress,
} from "./registry"

const registry = buildAlphaStethRegistry()

export function wrapConnector(connector: Connector): Connector {
  const origGetProvider = connector.getProvider?.bind(connector)
  const origConnect = (connector as any).connect?.bind(connector)
  if (!origGetProvider) return connector
  // Wrap connect to emit a wallet_connect event after successful connect
  if (origConnect && !(connector as any).__sommConnectWrapped) {
    ;(connector as any).connect = async (...args: any[]) => {
      const res = await origConnect(...args)
      try {
        const prov: any = origGetProvider
          ? await origGetProvider()
          : null
        // Resolve account with robust fallbacks
        let account =
          (res?.account as string | undefined) || undefined
        if (!account && prov?.request) {
          try {
            const accs: string[] = await prov.request({
              method: "eth_accounts",
            })
            account = accs?.[0]
          } catch {}
          if (!account) {
            try {
              const accs: string[] = await prov.request({
                method: "eth_requestAccounts",
              })
              account = accs?.[0]
            } catch {}
          }
        }
        // Resolve chainId with fallbacks
        let chainId =
          (res?.chain?.id as number | undefined) || undefined
        if (!chainId && prov?.request) {
          try {
            const hex = await prov.request({ method: "eth_chainId" })
            chainId =
              typeof hex === "string"
                ? parseInt(hex, 16)
                : Number(hex)
            if (Number.isNaN(chainId)) chainId = undefined
          } catch {}
        }
        fetch("/api/ingest-rpc", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            events: [
              {
                stage: "request",
                domain: window.location.hostname,
                pagePath:
                  window.location.pathname + window.location.search,
                sessionId:
                  localStorage.getItem("somm_session_id") || "",
                method: "wallet_connect",
                wallet: account,
                chainId,
                clientConnector:
                  (connector as any)?.name || (connector as any)?.id,
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                timestampMs: Date.now(),
              },
            ],
          }),
          keepalive: true,
        })
      } catch {}
      return res
    }
    ;(connector as any).__sommConnectWrapped = true
  }
  ;(connector as any).getProvider = async (...args: any[]) => {
    const provider: any = await origGetProvider(...args)
    if (
      provider &&
      typeof provider.request === "function" &&
      !provider.__sommWrapped
    ) {
      const orig = provider.request.bind(provider)
      const getChainId = async (): Promise<number | undefined> => {
        try {
          // Prefer direct property if available
          if (provider?.chainId != null) {
            if (typeof provider.chainId === "string") {
              const id = parseInt(provider.chainId, 16)
              if (!Number.isNaN(id)) return id
            } else {
              const id = Number(provider.chainId)
              if (!Number.isNaN(id)) return id
            }
          }
          if (provider?.networkVersion != null) {
            const id = Number(provider.networkVersion)
            if (!Number.isNaN(id)) return id
          }
          // Fallback to RPC request
          const hex = await provider.request({
            method: "eth_chainId",
          })
          const id =
            typeof hex === "string" ? parseInt(hex, 16) : Number(hex)
          if (!Number.isNaN(id)) return id
        } catch {}
        return undefined
      }
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
              const txHash =
                typeof res === "string"
                  ? res
                  : (res?.hash as string | undefined)
              const chainId = await getChainId()
              const clientConnector =
                (connector as any)?.name || (connector as any)?.id
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
                      chainId,
                      clientConnector,
                      userAgent: navigator.userAgent,
                      platform: navigator.platform,
                      to,
                      txHash,
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

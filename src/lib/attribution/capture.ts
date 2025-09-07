import { http, Transport } from "viem"
import {
  buildAlphaStethRegistry,
  isAttributedAddress,
} from "./registry"

export type RpcStage = "request" | "submitted" | "receipt" | "error"

export type RpcEvent = {
  stage: RpcStage
  domain: string
  pagePath: string
  sessionId: string
  wallet?: string
  chainId?: number
  method: string
  paramsRedacted?: unknown
  txHash?: string
  to?: string
  contractMatch?: boolean
  strategyKey?: string
  timestampMs: number
  userAgent?: string
  platform?: string
}

function redactParams(method: string, params: unknown): unknown {
  try {
    if (method === "eth_sendRawTransaction") return undefined
    return params
  } catch {
    return undefined
  }
}

async function sendToIngest(events: RpcEvent[]) {
  try {
    await fetch("/api/ingest-rpc", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ events }),
      keepalive: true,
    })
  } catch {}
}

export function createCapturingTransport(args: {
  url: string
  getContext: () => {
    domain: string
    pagePath: string
    sessionId: string
    wallet?: string
  }
}): Transport {
  const base = http(args.url)
  const registry = buildAlphaStethRegistry()

  return ({ chain }) => {
    const inner = base({ chain })
    return {
      ...inner,
      async request({ method, params }) {
        const { domain, pagePath, sessionId, wallet } =
          args.getContext()
        const timestampMs = Date.now()
        const ua =
          typeof navigator !== "undefined"
            ? navigator.userAgent
            : undefined
        const platform =
          typeof navigator !== "undefined"
            ? navigator.platform
            : undefined
        const requestEvent: RpcEvent = {
          stage: "request",
          domain,
          pagePath,
          sessionId,
          wallet,
          chainId: chain?.id,
          method,
          paramsRedacted: redactParams(method, params),
          timestampMs,
          userAgent: ua,
          platform,
        }
        sendToIngest([requestEvent])

        try {
          const result: any = await inner.request({ method, params })

          if (
            method === "eth_sendTransaction" ||
            method === "eth_sendRawTransaction"
          ) {
            const txHash: string =
              typeof result === "string" ? result : result?.hash
            const to: string | undefined =
              Array.isArray(params) && (params[0] as any)?.to
            const evt: RpcEvent = {
              stage: "submitted",
              domain,
              pagePath,
              sessionId,
              wallet,
              chainId: chain?.id,
              method,
              txHash,
              to,
              contractMatch: isAttributedAddress(registry, to),
              strategyKey: "ALPHA_STETH",
              timestampMs: Date.now(),
              userAgent: ua,
              platform,
            }
            sendToIngest([evt])
          }

          return result
        } catch (err: any) {
          const evt: RpcEvent = {
            stage: "error",
            domain,
            pagePath,
            sessionId,
            wallet,
            chainId: chain?.id,
            method,
            paramsRedacted: redactParams(method, params),
            timestampMs: Date.now(),
            userAgent: ua,
            platform,
          }
          sendToIngest([evt])
          throw err
        }
      },
    }
  }
}

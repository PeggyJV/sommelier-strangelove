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
  // Optional fields for deposit attribution
  amount?: string
  status?: string
  timestampMs: number
}

const getTxHash = (result: unknown): string | undefined => {
  if (typeof result === "string") return result
  if (
    result &&
    typeof result === "object" &&
    "hash" in result &&
    typeof (result as { hash?: unknown }).hash === "string"
  ) {
    return (result as { hash: string }).hash
  }
  return undefined
}

const getToAddress = (params: unknown): string | undefined => {
  if (!Array.isArray(params)) return undefined
  const first = params[0]
  if (
    first &&
    typeof first === "object" &&
    "to" in first &&
    typeof (first as { to?: unknown }).to === "string"
  ) {
    return (first as { to: string }).to
  }
  return undefined
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
    const wrappedRequest = (async (
      payload: Parameters<typeof inner.request>[0]
    ) => {
      const { method, params } = payload
      const { domain, pagePath, sessionId, wallet } =
        args.getContext()
      const timestampMs = Date.now()
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
      }
      sendToIngest([requestEvent])

      try {
        const result = await inner.request({
          method,
          params,
        })

        if (
          method === "eth_sendTransaction" ||
          method === "eth_sendRawTransaction"
        ) {
          const txHash = getTxHash(result)
          const to = getToAddress(params)
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
          }
          sendToIngest([evt])
        }

        return result
      } catch (err: unknown) {
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
        }
        sendToIngest([evt])
        throw err
      }
    }) as typeof inner.request

    return {
      ...inner,
      request: wrappedRequest,
    }
  }
}

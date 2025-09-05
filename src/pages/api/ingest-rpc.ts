import type { NextApiRequest, NextApiResponse } from "next"
import {
  zadd,
  setJson,
  sadd,
  incr,
  expire,
} from "src/lib/attribution/kv"

type RpcEvent = {
  stage: "request" | "submitted" | "receipt" | "error"
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
}

function domainAllowed(host?: string) {
  if (!host) return false
  return host.endsWith("somm.finance") || host.endsWith("sommelier.finance")
}

function keyEvent(ts: number, id: string) {
  return `rpc:evt:${ts}:${id}`
}

function dayFromTs(ts: number) {
  const d = new Date(ts)
  return d.toISOString().slice(0, 10)
}

function ulidLike() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function rateLimit(bucket: string, limit: number) {
  const key = `rpc:rl:${bucket}:${new Date()
    .toISOString()
    .slice(0, 16)}` // per minute
  const c = ((await incr(key)) as number) || 0
  await expire(key, 120)
  return c <= limit
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end()
  const origin = req.headers["x-forwarded-host"] || req.headers.host
  if (!domainAllowed(String(origin))) return res.status(403).end()

  const limit = parseInt(
    process.env.ATTRIBUTION_RATE_LIMIT_PER_MINUTE || "120"
  )
  const bucket = `${req.socket.remoteAddress}`
  const allowed = await rateLimit(bucket, limit)
  if (!allowed)
    return res.status(429).json({ ok: false, reason: "rate_limited" })

  const body = req.body
  if (!body || !Array.isArray(body.events))
    return res.status(400).end()
  const events: RpcEvent[] = body.events

  const pipeline: Array<Promise<unknown>> = []
  for (const evt of events) {
    const id = ulidLike()
    const key = keyEvent(evt.timestampMs || Date.now(), id)
    pipeline.push(setJson(key, evt))

    // Indices
    const day = dayFromTs(evt.timestampMs || Date.now())
    if (evt.wallet) {
      pipeline.push(
        zadd(
          `rpc:index:wallet:${evt.wallet}:${day}`,
          evt.timestampMs,
          key
        )
      )
    }
    if (evt.txHash) {
      pipeline.push(sadd(`rpc:index:tx:${evt.txHash}`, key))
    }
    if (evt.to) {
      pipeline.push(
        zadd(
          `rpc:index:contract:${evt.to.toLowerCase()}:${day}`,
          evt.timestampMs,
          key
        )
      )
    }
  }

  await Promise.all(pipeline)
  res.json({ ok: true, count: events.length })
}

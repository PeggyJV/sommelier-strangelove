import type { NextApiRequest, NextApiResponse } from "next"
import {
  zadd,
  setJson,
  sadd,
  incr,
  expire,
} from "src/lib/attribution/kv"

function normalizeHost(input?: string) {
  if (!input) return ""
  try {
    if (/^https?:\/\//i.test(input))
      return new URL(input).hostname.toLowerCase()
    return String(input).split("/")[0].split(":")[0].toLowerCase()
  } catch {
    return String(input).toLowerCase()
  }
}

function parseAllowlist(envValue?: string) {
  return (envValue || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
    .map((s) => (s.startsWith(".") ? s.slice(1) : s))
}

function isHostAllowed(host: string, allow: string[]) {
  if (!host) return false
  return allow.some((suf) => host === suf || host.endsWith(`.${suf}`))
}

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
  // Optional fields for deposit attribution enrichment
  amount?: string
  status?: string
  blockNumber?: number
  blockHash?: string
  token?: string
  decimals?: number
  timestampMs: number
}

// legacy domain check removed; allowlist below is the single source of truth

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
  const enabled =
    process.env.NEXT_PUBLIC_ATTRIBUTION_ENABLED === "true"
  res.setHeader("x-somm-attrib-enabled", enabled ? "true" : "false")
  if (!enabled) return res.status(403).json({ error: "disabled" })

  // Allowlist check (by host suffix)
  const rawAllow =
    process.env.ATTRIBUTION_ALLOW_HOST_SUFFIXES ||
    "localhost,127.0.0.1,vercel.app,app.somm.finance,somm.finance"
  const allow = parseAllowlist(rawAllow)
  const rawHost =
    (req.headers["x-forwarded-host"] as string) ||
    (req.headers.host as string) ||
    ""
  const origin = req.headers.origin || ""
  const referer = req.headers.referer || ""
  const host = normalizeHost(rawHost)
  const originHost = normalizeHost(
    Array.isArray(origin) ? origin[0] : origin
  )
  const refererHost = normalizeHost(
    Array.isArray(referer) ? referer[0] : referer
  )

  res.setHeader("x-somm-allowed-host-suffixes", allow.join(","))
  res.setHeader("x-somm-ingest-host", rawHost)
  res.setHeader("x-somm-ingest-host-normalized", host)

  const hostOk =
    (!!host && isHostAllowed(host, allow)) ||
    (!!originHost && isHostAllowed(originHost, allow)) ||
    (!!refererHost && isHostAllowed(refererHost, allow))

  if (!hostOk) {
    res.setHeader("x-somm-ingest-deny-reason", "host-not-allowed")
    return res.status(403).json({ error: "host not allowed" })
  }

  if (req.method !== "POST") return res.status(405).end()

  try {
    const limit = parseInt(
      process.env.ATTRIBUTION_RATE_LIMIT_PER_MINUTE || "120"
    )
    const bucket = `${req.socket.remoteAddress}`
    const rlAllowed = await rateLimit(bucket, limit)
    if (!rlAllowed)
      return res
        .status(429)
        .json({ ok: false, error: "rate limited" })
  } catch {
    // non-fatal
  }

  const body = req.body
  if (!body) return res.status(400).end()
  let events: RpcEvent[] = []
  if (Array.isArray((body as any).events)) {
    events = (body as any).events as RpcEvent[]
  } else if ((body as any).txHash) {
    const txHash = String((body as any).txHash)
    const to = (body as any).to
      ? String((body as any).to).toLowerCase()
      : undefined
    const wallet = (body as any).from
      ? String((body as any).from).toLowerCase()
      : undefined
    const now = Date.now()
    events = [
      {
        stage: "submitted",
        domain: "local",
        pagePath: "/",
        sessionId: Math.random().toString(36).slice(2),
        wallet,
        chainId: 1,
        method: "eth_sendTransaction",
        txHash,
        to,
        timestampMs: now,
      },
    ]
  } else {
    return res.status(400).end()
  }

  const pipeline: Array<Promise<unknown>> = []
  for (const evt of events) {
    // normalize addresses to lowercase for indexing
    if (evt.wallet) evt.wallet = evt.wallet.toLowerCase()
    if (evt.to) evt.to = evt.to.toLowerCase()
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
          `rpc:index:contract:${evt.to}:${day}`,
          evt.timestampMs,
          key
        )
      )
    }
  }

  await Promise.all(pipeline)

  // Alpha STETH deposit specialized indexing (by wallet and by block)
  try {
    const depositWrites: Array<Promise<any>> = []
    for (const evt of events) {
      const isAlphaStethDepositReceipt =
        evt.stage === "receipt" &&
        evt.method === "deposit" &&
        evt.strategyKey === "ALPHA_STETH" &&
        !!evt.txHash &&
        typeof evt.blockNumber === "number" &&
        !!evt.wallet

      if (!isAlphaStethDepositReceipt) continue

      const chainId = evt.chainId || 1
      const txHash = String(evt.txHash)
      const blockNumber = Number(evt.blockNumber)
      const wallet = (evt.wallet || "").toLowerCase()
      const amount = evt.amount ? String(evt.amount) : undefined

      const eventId = `${chainId}:${txHash}`
      const eventKey = `alpha-steth:deposit:event:${eventId}`

      const record = {
        product: "alpha-steth",
        chainId,
        txHash,
        to: evt.to,
        blockNumber,
        blockHash: evt.blockHash || null,
        ethAddress: wallet,
        amount,
        token: evt.token ?? null,
        decimals:
          typeof evt.decimals === "number" ? evt.decimals : null,
        timestamp: evt.timestampMs || Date.now(),
        domain: evt.domain,
        pagePath: evt.pagePath,
        sessionId: evt.sessionId,
        status: evt.status || "success",
      }

      depositWrites.push(setJson(eventKey, record))
      depositWrites.push(
        zadd(
          `alpha-steth:deposit:index:eth:${wallet}:by_block`,
          blockNumber,
          eventId
        )
      )
      depositWrites.push(
        zadd(
          `alpha-steth:deposit:index:block:global`,
          blockNumber,
          eventId
        )
      )
    }

    if (depositWrites.length) await Promise.all(depositWrites)
  } catch (e) {
    // Best-effort enrichment; do not fail request if this part fails
    console.error("alpha-steth deposit indexing error", e)
  }

  try {
    const kvUrl =
      process.env.ATTRIB_KV_KV_REST_API_URL ||
      process.env.KV_REST_API_URL ||
      ""
    if (kvUrl) {
      try {
        res.setHeader("x-somm-kv-host", new URL(kvUrl).host)
      } catch {}
    }
  } catch {}

  res.json({ ok: true, count: events.length })
}

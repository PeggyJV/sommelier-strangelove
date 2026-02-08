import { Redis } from "@upstash/redis"

// Single-source attribution KV client.
// Prefer ATTRIB_*; fall back to standard KV_* so we don't need duplicate envs.
const URL =
  process.env.ATTRIB_KV_KV_REST_API_URL ||
  process.env.KV_REST_API_URL ||
  ""
const TOKEN =
  process.env.ATTRIB_KV_KV_REST_API_TOKEN ||
  process.env.KV_REST_API_TOKEN ||
  ""

if (!URL || !TOKEN) {
  throw new Error(
    "[attrib-kv] Missing KV REST credentials. Provide ATTRIB_KV_KV_REST_API_URL/TOKEN or KV_REST_API_URL/TOKEN"
  )
}

export const kv = new Redis({ url: URL, token: TOKEN })

/** Set JSON value at key (stringify). */
export async function setJson(key: string, value: unknown) {
  const payload =
    typeof value === "string" ? value : JSON.stringify(value)
  await kv.set(key, payload)
}

/** Sorted set add: ZADD key score member */
export async function zadd(
  key: string,
  score: number,
  member: string
) {
  // Upstash expects an array of { score, member }
  await kv.zadd(key, { score, member })
}

/** Set add: SADD key member */
export async function sadd(key: string, member: string) {
  await kv.sadd(key, member)
}

/** Atomic increment: INCR key */
export async function incr(key: string) {
  return kv.incr(key)
}

/** Set expiry in seconds: EXPIRE key seconds */
export async function expire(key: string, seconds: number) {
  await kv.expire(key, seconds)
}

// Optional helpers used by some diagnostics/report code:
export async function get(key: string) {
  return kv.get(key) as unknown as Promise<string | null>
}

export async function smembers(key: string) {
  return kv.smembers(key) as unknown as Promise<string[]>
}

/** Get and JSON-parse a value if possible. */
export async function getJson<T = unknown>(key: string) {
  const raw = (await kv.get(key)) as unknown
  if (raw == null) return null as unknown as T | null
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw) as T
    } catch {
      return raw as unknown as T
    }
  }
  return raw as unknown as T
}

/** Simple wrapper for ZRANGE start..end returning members only. */
export async function zrange(
  key: string,
  start: number,
  end: number
) {
  const client = kv as unknown as {
    zrange?: (key: string, start: number, end: number) => Promise<string[]>
    zrangebyscore?: (
      key: string,
      min: string,
      max: string
    ) => Promise<string[]>
  }
  if (typeof client.zrange === "function") {
    return (await client.zrange(key, start, end)) as string[]
  }
  // Fallback: fetch all via score range if supported
  if (typeof client.zrangebyscore === "function") {
    return (await client.zrangebyscore(
      key,
      "-inf",
      "+inf"
    )) as string[]
  }
  return [] as string[]
}

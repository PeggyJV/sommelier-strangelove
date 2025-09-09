import { Redis } from "@upstash/redis"

// Forbid legacy KV_* envs anywhere
const forbidden = [
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "KV_REST_API_READ_ONLY_TOKEN",
  "KV_URL",
]
for (const n of forbidden) {
  if (process.env[n]) {
    throw new Error(
      `[attrib-kv] Forbidden legacy env present: ${n}. Use ATTRIB_KV_KV_REST_API_URL/TOKEN only.`
    )
  }
}

const URL = process.env.ATTRIB_KV_KV_REST_API_URL || ""
const TOKEN = process.env.ATTRIB_KV_KV_REST_API_TOKEN || ""

if (!URL || !TOKEN) {
  throw new Error(
    "[attrib-kv] Missing ATTRIB_KV_KV_REST_API_URL or ATTRIB_KV_KV_REST_API_TOKEN"
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

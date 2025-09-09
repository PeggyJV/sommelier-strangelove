import { kv } from "@vercel/kv"

// Thin wrappers around @vercel/kv to keep the existing call sites unchanged.
// @vercel/kv reads KV_REST_API_URL and KV_REST_API_TOKEN from the environment.
// We intentionally drop the custom ATTRIB_KV_* indirection to standardize on Vercel KV.

export async function setJson(key: string, value: unknown) {
  await kv.set(key, JSON.stringify(value))
}

export async function getJson<T = unknown>(key: string): Promise<T | null> {
  const raw = (await kv.get<string | null>(key)) as string | null
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function zadd(key: string, score: number, member: string) {
  // @vercel/kv expects an object { score, member }
  await (kv as any).zadd(key, { score, member })
}

export async function zrange(key: string, start: number, stop: number) {
  const res = (await (kv as any).zrange(key, start, stop)) as unknown
  return (res as string[]) || []
}

export async function sadd(key: string, member: string) {
  await (kv as any).sadd(key, member)
}

export async function smembers(key: string) {
  const res = (await (kv as any).smembers(key)) as unknown
  return (res as string[]) || []
}

export async function incr(key: string) {
  return await (kv as any).incr(key)
}

export async function expire(key: string, seconds: number) {
  await (kv as any).expire(key, seconds)
}

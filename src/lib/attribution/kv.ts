import { Redis } from "@upstash/redis"

function getEnv(name: string): string | undefined {
  return process.env[name]
}

let client: Redis | null = null

export function getRedis(): Redis {
  if (client) return client
  const url =
    getEnv("ATTRIB_KV_KV_REST_API_URL") ||
    getEnv("KV_REST_API_URL") ||
    ""
  const token =
    getEnv("ATTRIB_KV_KV_REST_API_TOKEN") ||
    getEnv("KV_REST_API_TOKEN") ||
    ""
  if (!url || !token) {
    throw new Error(
      "Missing Redis credentials: set ATTRIB_KV_KV_REST_API_URL/TOKEN or KV_REST_API_URL/TOKEN"
    )
  }
  client = new Redis({ url, token })
  return client
}

export async function setJson(key: string, value: unknown) {
  const redis = getRedis()
  await redis.set(key, JSON.stringify(value))
}

export async function getJson<T = unknown>(
  key: string
): Promise<T | null> {
  const redis = getRedis()
  const raw = await redis.get<string | null>(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export async function zadd(
  key: string,
  score: number,
  member: string
) {
  const redis = getRedis()
  await redis.zadd(key, { score, member })
}

export async function zrange(
  key: string,
  start: number,
  stop: number
) {
  const redis = getRedis()
  return (await redis.zrange<string[]>(key, start, stop)) || []
}

export async function sadd(key: string, member: string) {
  const redis = getRedis()
  await redis.sadd(key, member)
}

export async function smembers(key: string) {
  const redis = getRedis()
  return (await redis.smembers<string[]>(key)) || []
}

export async function incr(key: string) {
  const redis = getRedis()
  return await redis.incr(key)
}

export async function expire(key: string, seconds: number) {
  const redis = getRedis()
  await redis.expire(key, seconds)
}

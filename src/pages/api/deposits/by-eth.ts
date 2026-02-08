import type { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"
import { getJson } from "src/lib/attribution/kv"

type ZRangeByScoreOptions = {
  limit: { offset: number; count: number }
}

type KVSortedClient = {
  zrange?: (key: string, start: number, stop: number) => Promise<string[]>
  zrangebyscore?: (
    key: string,
    min: string,
    max: string,
    opts: ZRangeByScoreOptions
  ) => Promise<string[]>
  zrevrangebyscore?: (
    key: string,
    max: string,
    min: string,
    opts: ZRangeByScoreOptions
  ) => Promise<string[]>
}

function normalizeAddress(addr?: string) {
  return (addr || "").toLowerCase()
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end()

  const addressRaw = String(req.query.address || "")
  if (!addressRaw || !addressRaw.startsWith("0x")) {
    return res
      .status(400)
      .json({ error: "address query param (0x…) is required" })
  }
  const address = normalizeAddress(addressRaw)

  const fromBlockQ = String(req.query.fromBlock || "-inf")
  const toBlockQ = String(req.query.toBlock || "+inf")
  const limit = parseInt(String(req.query.limit || "50"))
  const order = String(req.query.order || "asc").toLowerCase()

  const zkey = `alpha-steth:deposit:index:eth:${address}:by_block`

  // Use Upstash/Vercel KV zrangebyscore to fetch by block range
  let members: string[] = []
  try {
    const kvClient = kv as unknown as KVSortedClient
    const fn = kvClient.zrangebyscore || kvClient.zrange
    if (!fn) throw new Error("KV client zrangebyscore unavailable")

    // If zrangebyscore is unavailable, fall back to full range and filter
    if (kvClient.zrangebyscore && order === "asc") {
      members = await kvClient.zrangebyscore(
        zkey,
        fromBlockQ,
        toBlockQ,
        {
          limit: { offset: 0, count: limit },
        }
      )
    } else if (kvClient.zrevrangebyscore && order === "desc") {
      members = await kvClient.zrevrangebyscore(
        zkey,
        toBlockQ,
        fromBlockQ,
        {
          limit: { offset: 0, count: limit },
        }
      )
    } else {
      const all = (await kvClient.zrange?.(zkey, 0, -1)) || []
      // Fallback: if desc, take last N and keep descending order
      members = order === "desc" ? all.slice(-limit).reverse() : all.slice(0, limit)
    }
  } catch (e) {
    return res.status(500).json({ error: "kv_error", detail: String(e) })
  }

  if (!members?.length) return res.json([])

  const keys = members.map((m) => `alpha-steth:deposit:event:${m}`)
  const reads = keys.map((k) => getJson(k))
  const records = await Promise.all(reads)

  res.json(records.filter(Boolean))
}

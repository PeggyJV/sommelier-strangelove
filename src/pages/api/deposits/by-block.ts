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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end()

  const fromBlock = req.query.fromBlock
  const toBlock = req.query.toBlock
  const limit = parseInt(String(req.query.limit || "100"))
  const order = String(req.query.order || "asc").toLowerCase()

  if (fromBlock === undefined || toBlock === undefined) {
    return res
      .status(400)
      .json({ error: "fromBlock and toBlock query params are required" })
  }

  const min = String(fromBlock || "-inf")
  const max = String(toBlock || "+inf")

  const zkey = `alpha-steth:deposit:index:block:global`

  let members: string[] = []
  try {
    const kvClient = kv as unknown as KVSortedClient
    const fn = kvClient.zrangebyscore || kvClient.zrange
    if (!fn) throw new Error("KV client zrangebyscore unavailable")

    if (kvClient.zrangebyscore && order === "asc") {
      members = await kvClient.zrangebyscore(
        zkey,
        min,
        max,
        {
          limit: { offset: 0, count: limit },
        }
      )
    } else if (kvClient.zrevrangebyscore && order === "desc") {
      members = await kvClient.zrevrangebyscore(
        zkey,
        max,
        min,
        {
          limit: { offset: 0, count: limit },
        }
      )
    } else {
      const all = (await kvClient.zrange?.(zkey, 0, -1)) || []
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

import type { NextApiRequest, NextApiResponse } from "next"
import { kv } from "@vercel/kv"
import { getJson } from "src/lib/attribution/kv"

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
    const fn: any = (kv as any).zrangebyscore || (kv as any).zrange
    if (!fn) throw new Error("KV client zrangebyscore unavailable")

    if ((kv as any).zrangebyscore && order === "asc") {
      members = (await (kv as any).zrangebyscore(
        zkey,
        min,
        max,
        {
          limit: { offset: 0, count: limit },
        }
      )) as string[]
    } else if ((kv as any).zrevrangebyscore && order === "desc") {
      members = (await (kv as any).zrevrangebyscore(
        zkey,
        max,
        min,
        {
          limit: { offset: 0, count: limit },
        }
      )) as string[]
    } else {
      const all = (await (kv as any).zrange(zkey, 0, -1)) as string[]
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


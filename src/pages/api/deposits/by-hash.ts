import type { NextApiRequest, NextApiResponse } from "next"
import { getJson } from "src/lib/attribution/kv"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end()

  const tx = String(req.query.tx || "")
  if (!tx || !tx.startsWith("0x")) {
    return res.status(400).json({ error: "tx query param (0x…) is required" })
  }
  const chainId = parseInt(String(req.query.chainId || "1")) || 1

  const key = `alpha-steth:deposit:event:${chainId}:${tx}`
  const record = await getJson(key)

  if (!record) return res.status(404).json({ error: "not_found" })
  return res.json(record)
}


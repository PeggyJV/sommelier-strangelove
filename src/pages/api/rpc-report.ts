import type { NextApiRequest, NextApiResponse } from "next"
import { getJson, zrange } from "src/lib/attribution/kv"

function parseDate(s?: string) {
  if (!s) return null
  const d = new Date(s)
  return isNaN(d.getTime()) ? null : d
}

function csvEscape(v: unknown) {
  const s = String(v ?? "")
  if (s.includes(",") || s.includes("\n") || s.includes('"')) {
    return '"' + s.replace(/"/g, '""') + '"'
  }
  return s
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).end()

  const from = parseDate(String(req.query.from || ""))
  const to = parseDate(String(req.query.to || ""))
  const wallet = (req.query.wallet as string)?.toLowerCase() || undefined
  const contract =
    (req.query.contract as string)?.toLowerCase() || undefined
  const address =
    (req.query.address as string)?.toLowerCase() || undefined
  const limit = parseInt(String(req.query.limit || "100"))
  const format = (req.query.format as string) || "csv"
  const domain = (req.query.domain as string) || undefined

  if (!from || !to)
    return res.status(400).json({ error: "from/to required" })

  const days: string[] = []
  for (
    let d = new Date(
      Date.UTC(
        from.getUTCFullYear(),
        from.getUTCMonth(),
        from.getUTCDate()
      )
    );
    d <=
    new Date(
      Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate())
    );
    d.setUTCDate(d.getUTCDate() + 1)
  ) {
    days.push(d.toISOString().slice(0, 10))
  }

  if (format === "csv") {
    res.setHeader("Content-Type", "text/csv; charset=utf-8")
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="rpc-report-${days[0]}_to_${
        days[days.length - 1]
      }.csv"`
    )
  } else {
    res.setHeader("Content-Type", "application/json; charset=utf-8")
  }

  const contractFilter = contract || address
  const idxKeyPrefix = wallet
    ? (day: string) => `rpc:index:wallet:${wallet}:${day}`
    : contractFilter
    ? (day: string) => `rpc:index:contract:${contractFilter}:${day}`
    : null

  if (!idxKeyPrefix) {
    return res
      .status(400)
      .json({ error: "wallet or contract filter required" })
  }

  // For CSV responses, write header once after successful validation
  if (format === "csv") {
    const header = [
      "timestampMs",
      "txHash",
      "contractAddress",
      "wallet",
      "domain",
      "pagePath",
      "method",
      "stage",
      "amount",
      "status",
    ]
    res.write(header.join(",") + "\n")
  }

  for (const day of days) {
    const zkey = idxKeyPrefix(day)
    const members = (await zrange(zkey, 0, -1)) as string[]
    if (!members?.length) continue

    const pipeline: Array<Promise<any>> = []
    for (const m of members.slice(-limit)) pipeline.push(getJson(m))
    const results = await Promise.all(pipeline)

    for (const raw of results) {
      const evt = raw
      if (!evt) continue
      if (domain && evt.domain !== domain) continue

      if (format === "csv") {
        const row = [
          csvEscape(evt.timestampMs),
          csvEscape(evt.txHash),
          csvEscape(evt.to),
          csvEscape(evt.wallet),
          csvEscape(evt.domain),
          csvEscape(evt.pagePath),
          csvEscape(evt.method),
          csvEscape(evt.stage),
          csvEscape(evt.amount),
          csvEscape(evt.status),
        ]
        res.write(row.join(",") + "\n")
      } else {
        res.write(JSON.stringify(evt) + "\n")
      }
    }
  }

  res.end()
}

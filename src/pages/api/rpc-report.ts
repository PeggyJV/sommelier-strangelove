import type { NextApiRequest, NextApiResponse } from "next"
import { getJson, zrange } from "src/lib/attribution/kv"

type RpcReportEvent = {
  timestampMs?: number
  txHash?: string
  to?: string
  wallet?: string
  domain?: string
  pagePath?: string
  method?: string
  stage?: string
  amount?: string
  status?: string
}

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
  const wallet =
    (req.query.wallet as string)?.toLowerCase() || undefined
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

  // Debug/observability headers to validate runtime KV configuration
  try {
    const attribUrl = process.env.ATTRIB_KV_KV_REST_API_URL || ""
    const fallbackUrl = process.env.KV_REST_API_URL || ""
    const using = attribUrl ? "ATTRIB" : fallbackUrl ? "KV" : "NONE"
    const chosenUrl = attribUrl || fallbackUrl || ""
    let host = ""
    try {
      host = chosenUrl ? new URL(chosenUrl).host : ""
    } catch {}
    res.setHeader("x-somm-kv-source", using)
    if (host) res.setHeader("x-somm-kv-host", host)
    const sampleIdx = idxKeyPrefix(days[0])
    res.setHeader("x-somm-idx-sample", sampleIdx)
  } catch {}

  // Collect rows (buffered) to avoid streaming issues on some clients
  const csvRows: string[] = []
  const jsonRows: RpcReportEvent[] = []
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
    csvRows.push(header.join(","))
  }

  for (const day of days) {
    const zkey = idxKeyPrefix(day)
    const members = (await zrange(zkey, 0, -1)) as string[]
    if (!members?.length) continue

    const pipeline: Array<Promise<unknown>> = []
    for (const m of members.slice(-limit)) pipeline.push(getJson(m))
    const results = await Promise.all(pipeline)

    for (const raw of results) {
      const evt = raw as RpcReportEvent | null
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
        csvRows.push(row.join(","))
      } else {
        jsonRows.push(evt)
      }
    }
  }
  if (format === "csv") {
    res.send(csvRows.join("\n") + "\n")
  } else {
    res.json(jsonRows)
  }
}

import type { NextApiRequest, NextApiResponse } from "next"

// Small helper: coerce query value to a single string (handles string | string[] | undefined)
function scalar(
  q: string | string[] | undefined
): string | undefined {
  if (typeof q === "string") return q
  if (Array.isArray(q)) return q[0]
  return undefined
}
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

  // === TEMP DEBUG (safe): echo parsed query keys to a header
  try {
    const keys = Object.keys(req.query || {}).sort()
    res.setHeader("x-somm-query-keys", keys.join(","))
  } catch {}

  const q = req.query || {}
  const txRaw = scalar(q.tx)
  const fromRaw = scalar(q.from)
  const toRaw = scalar(q.to)
  const dateRaw = scalar(q.date)

  const tx = txRaw?.toLowerCase()
  const fromQ = fromRaw?.toLowerCase()
  const toQ = toRaw?.toLowerCase()

  // If tx is provided, do NOT parse or touch date at all.
  if (tx) {
    res.setHeader("x-somm-date-source", "skipped-for-tx")
    // keep existing tx-only logic below untouched; ensure none of it uses `date`/`dayStart`.
  }

  // Only when tx is NOT provided, require and parse date
  let dayStart: Date | undefined
  if (!tx) {
    if (!fromQ)
      return res
        .status(400)
        .json({ error: "missing 'from' (0x... address)" })
    if (!toQ)
      return res
        .status(400)
        .json({ error: "missing 'to' (0x... address)" })
    if (!dateRaw)
      return res
        .status(400)
        .json({ error: "missing 'date' (YYYY-MM-DD, UTC)" })
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateRaw)
    if (!m)
      return res.status(400).json({
        error: "bad 'date' format (expected YYYY-MM-DD in UTC)",
      })
    dayStart = new Date(`${dateRaw}T00:00:00.000Z`)
    if (isNaN(dayStart.getTime()))
      return res.status(400).json({ error: "invalid 'date' value" })
    res.setHeader("x-somm-date-source", "parsed")
    res.setHeader(
      "x-somm-date-iso",
      dayStart.toISOString().slice(0, 10)
    )
  }

  // Guarantee a non-null date for all UTC reads:
  // - tx-only path → use today UTC
  // - missing/invalid date in from/to/date → fall back to today UTC (and mark fallback)
  const fallback = new Date() // today UTC
  const dateForBuckets = dayStart ?? fallback
  if (!dayStart) res.setHeader("x-somm-date-fallback", "1")
  res.setHeader("x-somm-date-guard", "applied")
  // IMPORTANT: ensure any later use of `dayStart` is non-null
  dayStart = dateForBuckets

  // Precompute parts to avoid any `.getUTC*` reads on possibly-null variables elsewhere
  const y = dateForBuckets.getUTCFullYear()
  const m = dateForBuckets.getUTCMonth() + 1
  const d = dateForBuckets.getUTCDate()
  const isoDay = `${y}-${String(m).padStart(2, "0")}-${String(
    d
  ).padStart(2, "0")}`
  // Helpful header for debugging which date was actually used
  if (!res.getHeader("x-somm-date-iso"))
    res.setHeader("x-somm-date-iso", isoDay)

  const from = parseDate(String(fromQ || ""))
  const to = parseDate(String(toQ || ""))
  const wallet =
    (req.query.wallet as string)?.toLowerCase() || undefined
  const contract =
    (req.query.contract as string)?.toLowerCase() || undefined
  const address =
    (req.query.address as string)?.toLowerCase() || undefined
  const limit = parseInt(String(req.query.limit || "100"))
  const format = (req.query.format as string) || "csv"
  const domain = (req.query.domain as string) || undefined

  // (validation for fromQ/toQ/date is handled above when !tx)

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
  const jsonRows: any[] = []
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

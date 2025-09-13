import fetch from "node-fetch"
import * as dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env.vercel") })

const ACCESS_KEY = process.env.DEBANK_ACCESS_KEY
if (!ACCESS_KEY) throw new Error("Missing DEBANK_ACCESS_KEY in env")

const DEFAULT_WALLETS = [
  "0x1222f0baA62e2282Bfd01083C7C3732A8c611584",
  "0xC3B356C5E0dA0355560c8f2E4189Fb1c5d2981Cd",
]

function parseWallets(): string[] {
  const fromEnv = (process.env.WALLETS || "").trim()
  if (!fromEnv) return DEFAULT_WALLETS
  return fromEnv
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean)
}

function toISO(ts?: number | string): string {
  if (!ts) return ""
  const n = typeof ts === "string" ? Number(ts) : ts
  if (!Number.isFinite(n)) return String(ts)
  // Debank returns ms timestamps
  return new Date(Number(n)).toISOString()
}

function fmtRow(cols: string[], widths: number[]): string {
  return cols
    .map((c, i) => {
      const w = widths[i]
      const v = c.length > w ? c.slice(0, w - 1) + "…" : c
      return v.padEnd(w, " ")
    })
    .join("  ")
}

async function fetchHistory(addr: string, limit: number) {
  const url = `https://pro-openapi.debank.com/v1/official/message/history?addr=${addr}`
  const res = await fetch(url, {
    headers: { AccessKey: ACCESS_KEY as string },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 404) return []
    throw new Error(
      `History ${addr} HTTP ${res.status}: ${JSON.stringify(json)}`
    )
  }
  const items: any[] = Array.isArray(json?.result) ? json.result : []
  return items.slice(0, limit)
}

async function fetchGroupStatus(id: string) {
  const url = `https://pro-openapi.debank.com/v1/official/group_status?id=${encodeURIComponent(
    id
  )}`
  const res = await fetch(url, {
    headers: { AccessKey: ACCESS_KEY as string },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok)
    throw new Error(
      `group_status HTTP ${res.status}: ${JSON.stringify(json)}`
    )
  return json
}

async function main() {
  const wallets = parseWallets()
  const limit = Number(process.env.LIMIT || 10)
  const contains = (process.env.ONLY_CONTAINS || "").toLowerCase()
  const groupId = process.env.GROUP_ID

  for (const w of wallets) {
    console.log(`\nWallet: ${w}`)
    const items = await fetchHistory(w, limit)
    const filtered = contains
      ? items.filter((it) =>
          String(it?.content?.value?.data || it?.content?.data || "")
            .toLowerCase()
            .includes(contains)
        )
      : items

    const rows = filtered.map((it) => [
      toISO(it?.create_at || it?.created_at || it?.time),
      String(it?.content?.value?.data || it?.content?.data || ""),
      String(it?.content?.value?.url || it?.content?.url || ""),
    ])

    const widths = [24, 80, 80]
    console.log(fmtRow(["timestamp", "text", "url"], widths))
    console.log(
      fmtRow(["-".repeat(9), "-".repeat(4), "-".repeat(3)], widths)
    )
    for (const r of rows) console.log(fmtRow(r, widths))
    if (rows.length === 0) console.log("(no messages)")
  }

  if (groupId) {
    console.log("\nGroup status:")
    const status = await fetchGroupStatus(groupId)
    console.log(JSON.stringify(status, null, 2))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

/*
 Value-based ranking for ACTIVE users using DeBank Cloud.
 - Reads ACTIVE wallets from OUT_DIR/active_debank.csv (header: wallet)
 - Fetches Sommelier USD value via DeBank complex_protocol_list
 - RPS limit 5, retries up to 3 with exponential backoff
 - Writes 3 CSVs: top100_by_value, top100_messages, top100_debank
*/

import fs from "fs"
import path from "path"
import os from "os"
import fetch from "node-fetch"

type ProtocolItem = {
  id?: string
  project_id?: string
  portfolio_item_list?: Array<{
    stats?: { net_usd_value?: number | null }
    detail?: { net_usd_value?: number | null }
  }>
}

const RPS = 5
const MIN_DELAY_MS = Math.ceil(1000 / RPS)
const MAX_RETRIES = 3
const BASE_URL = "https://pro-openapi.debank.com"
const ACCESS_KEY = process.env.DEBANK_ACCESS_KEY

if (!ACCESS_KEY) {
  console.error("Missing DEBANK_ACCESS_KEY in env")
  process.exit(1)
}

const DEFAULT_OUT_DIR = path.join(
  os.homedir(),
  "Desktop",
  "on-chain-marketing",
  "outputs"
)
const OUT_DIR = process.env.OUT_DIR || DEFAULT_OUT_DIR

const INPUT_CSV = path.join(OUT_DIR, "active_debank.csv")
const OUTPUT_TOP100_BY_VALUE = path.join(
  OUT_DIR,
  "active_top100_by_value.csv"
)
const OUTPUT_TOP100_MESSAGES = path.join(
  OUT_DIR,
  "active_top100_messages.csv"
)
const OUTPUT_TOP100_DEBANK = path.join(
  OUT_DIR,
  "active_top100_debank.csv"
)

const MESSAGE_COPY =
  "Try Alpha stETH, our upgraded, even more adaptive stETH strategy. Be early and migrate in a click: https://app.somm.finance/strategies/alpha-steth/manage?src=debank_active_top100"

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseCsvWallets(filePath: string): string[] {
  if (!fs.existsSync(filePath)) {
    console.error(`Input CSV not found at ${filePath}`)
    process.exit(1)
  }
  const raw = fs.readFileSync(filePath, "utf8")
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  if (lines.length === 0) return []
  const header = lines[0]
    .split(",")
    .map((h) => h.trim().toLowerCase())
  const walletIdx = header.indexOf("wallet")
  if (walletIdx === -1) {
    console.error("CSV header must include 'wallet'")
    process.exit(1)
  }
  const wallets: string[] = []
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",")
    const wallet = (cols[walletIdx] || "").trim()
    if (wallet) wallets.push(wallet)
  }
  return wallets
}

function isSommelierItem(item: ProtocolItem): boolean {
  const id = (item.id || "").toString().toLowerCase()
  const pid = (item.project_id || "").toString().toLowerCase()
  return id === "sommelier" || pid === "sommelier"
}

function sumNetUsd(item: ProtocolItem): number {
  const list = item.portfolio_item_list || []
  let total = 0
  for (const p of list) {
    const statsVal = p?.stats?.net_usd_value
    const detailVal = p?.detail?.net_usd_value
    const v =
      (typeof statsVal === "number" ? statsVal : 0) +
      (typeof detailVal === "number" ? detailVal : 0)
    total += v
  }
  return total
}

async function fetchSommUsd(wallet: string): Promise<number> {
  const url = `${BASE_URL}/v1/user/complex_protocol_list?addr=${wallet}`
  let attempt = 0
  while (attempt <= MAX_RETRIES) {
    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          AccessKey: ACCESS_KEY as string,
        },
      })
      if (
        res.status === 429 ||
        (res.status >= 500 && res.status < 600)
      ) {
        attempt++
        if (attempt > MAX_RETRIES) break
        const backoff = Math.min(2000 * 2 ** (attempt - 1), 10000)
        await sleep(backoff)
        continue
      }
      if (!res.ok) {
        // non-retryable error
        return 0
      }
      const data = (await res.json()) as any
      const arr: ProtocolItem[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : []
      if (!arr.length) return 0
      const sommItems = arr.filter(isSommelierItem)
      if (!sommItems.length) return 0
      let total = 0
      for (const it of sommItems) total += sumNetUsd(it)
      return total
    } catch (e) {
      attempt++
      if (attempt > MAX_RETRIES) {
        return 0
      }
      const backoff = Math.min(2000 * 2 ** (attempt - 1), 10000)
      await sleep(backoff)
    }
  }
  return 0
}

function toCsvLine(values: (string | number)[]): string {
  return values
    .map((v) => {
      const s = String(v)
      if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/"/g, '""') + '"'
      }
      return s
    })
    .join(",")
}

async function main() {
  ensureDir(OUT_DIR)

  const wallets = parseCsvWallets(INPUT_CSV)
  if (wallets.length === 0) {
    console.log("No wallets to process")
    return
  }

  const results: { wallet: string; somm_usd: number }[] = []

  for (let i = 0; i < wallets.length; i++) {
    const w = wallets[i]
    const value = await fetchSommUsd(w)
    results.push({
      wallet: w,
      somm_usd: Number.isFinite(value) ? value : 0,
    })
    if ((i + 1) % 20 === 0) {
      console.log(`Processed ${i + 1}/${wallets.length} wallets...`)
    }
    if (i < wallets.length - 1) {
      await sleep(MIN_DELAY_MS)
    }
  }

  const top = results
    .filter((r) => (r.somm_usd || 0) > 0)
    .sort((a, b) => b.somm_usd - a.somm_usd)
    .slice(0, 100)

  // Write outputs
  const byValueLines = [
    "wallet,somm_usd",
    ...top.map((r) => toCsvLine([r.wallet, r.somm_usd.toFixed(2)])),
  ]
  fs.writeFileSync(OUTPUT_TOP100_BY_VALUE, byValueLines.join("\n"))

  const messagesLines = [
    "wallet,message",
    ...top.map((r) => toCsvLine([r.wallet, MESSAGE_COPY])),
  ]
  fs.writeFileSync(OUTPUT_TOP100_MESSAGES, messagesLines.join("\n"))

  const debankLines = ["wallet", ...top.map((r) => r.wallet)]
  fs.writeFileSync(OUTPUT_TOP100_DEBANK, debankLines.join("\n"))

  // Log summary
  const positiveCount = results.filter(
    (r) => (r.somm_usd || 0) > 0
  ).length
  const top1 = top[0]
  console.log(
    `Scanned ${wallets.length} active wallets; ${positiveCount} had >$0 in Sommelier.`
  )
  if (top1) {
    console.log(
      `Top wallet: ${top1.wallet} with $${top1.somm_usd.toFixed(2)}`
    )
  } else {
    console.log("No wallets with positive Sommelier value found.")
  }

  // Preview top-5
  const preview = top.slice(0, 5)
  if (preview.length) {
    console.log("Top 5 preview:")
    for (const r of preview) {
      console.log(`${r.wallet}, $${r.somm_usd.toFixed(2)}`)
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

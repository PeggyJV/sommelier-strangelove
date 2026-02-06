/*
  Generates MVP deposits report for Alpha stETH by calling the app's
  public API (Vercel KV-backed): /api/deposits/by-block.
  Writes:
  - public/reports/alpha-steth-deposits.json (daily time series)
  - docs/analytics/mvp-deposits.md (brief markdown summary)
  Optionally posts a Telegram message if BOT_TOKEN + CHAT_ID are present.
  This script is conservative: if env or data are missing, it exits 0.
*/
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import {
  validateEvents,
  generateValidationReport,
} from "./validate-events.mjs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE =
  process.env.REPORT_API_BASE ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://app.somm.finance"
// Telegram configuration (only used if --post-telegram flag is provided)
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_CHAT = process.env.TELEGRAM_CHAT_ID

const REPORT_DIR = path.join(process.cwd(), "public", "reports")
const DOCS_MD = path.join(
  process.cwd(),
  "docs",
  "analytics",
  "mvp-deposits.md"
)

function log(...args) {
  console.log("[alpha-deposits]", ...args)
}

async function apiFetch(pathAndQuery, init = {}) {
  const base = (API_BASE || "").replace(/\/$/, "")
  if (!base) {
    log("API base missing; skipping fetch")
    return null
  }
  const url = `${base}${pathAndQuery}`
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  })
  if (!res.ok) {
    log("api error", res.status, url)
    return null
  }
  try {
    return await res.json()
  } catch {
    return null
  }
}

// Fetch deposit events from the production API (Vercel KV-backed)
async function fetchDepositsAll(limit = 20000) {
  const q = `/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=${limit}`
  const data = await apiFetch(q)
  if (!Array.isArray(data)) return []
  return data
}

// Fetch current ETH price for USD calculations
async function fetchETHPrice() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
    const data = await response.json()
    return data.ethereum?.usd || null
  } catch (e) {
    log("Failed to fetch ETH price:", e.message)
    return null
  }
}

function parseAmountBase(amount, decimals) {
  if (amount == null) return 0
  const s = String(amount)
  // If looks like integer and decimals provided, scale down
  if (
    /^\d+$/.test(s) &&
    typeof decimals === "number" &&
    decimals > 0
  ) {
    const n = Number(s)
    if (!Number.isFinite(n)) return 0
    return n / Math.pow(10, decimals)
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

function toDateUTC(tsMs) {
  const d = new Date(tsMs)
  let dateStr = d.toISOString().slice(0, 10) // YYYY-MM-DD

  // Fix year typo: if date is 2024 but contract was deployed in 2025, assume it's 2025
  if (dateStr.startsWith("2024-")) {
    dateStr = dateStr.replace("2024-", "2025-")
  }

  return dateStr
}

async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2)
  const validateOnly = args.includes("--validate-only")
  const postTelegram = args.includes("--post-telegram")

  log("running with flags:", { validateOnly, postTelegram })

  // Check Telegram mode only if Telegram posting is requested
  if (postTelegram && process.env.TELEGRAM_MODE !== "strict") {
    console.log(
      "TG disabled: Use export-alpha-deposits.mjs for Telegram posting"
    )
    process.exit(0)
  }

  // Ensure dirs
  fs.mkdirSync(REPORT_DIR, { recursive: true })
  fs.mkdirSync(path.dirname(DOCS_MD), { recursive: true })

  // 1) Pull deposit entries from API and normalize
  const events = await fetchDepositsAll(20000)
  if (!events.length) {
    log("no deposit events from API; exiting 0")
    return
  }

  // 1.5) Validate production data before processing
  log("validating production data...")
  const latestBlock = Number(process.env.LATEST_BLOCK || 0)
  const minBlock = latestBlock ? latestBlock - 1_000_000 : undefined

  const validationResult = validateEvents(events, {
    apiBase: API_BASE,
    latestBlock,
    minBlock,
  })

  if (!validationResult.ok) {
    log("validation failed:", validationResult.summary)

    // Write validation failure report
    const report = generateValidationReport(validationResult)
    const validationFailPath = path.join(
      __dirname,
      "../../docs/analytics/validation-fail.md"
    )
    fs.mkdirSync(path.dirname(validationFailPath), {
      recursive: true,
    })
    fs.writeFileSync(validationFailPath, report)
    log("wrote validation failure report:", validationFailPath)

    // Log summary of violations
    validationResult.violations.forEach((violation, i) => {
      log(
        `violation ${i + 1}:`,
        violation.event.txHash,
        violation.errors[0]
      )
    })

    console.error(
      "Production data validation failed. Aborting Telegram and report generation."
    )
    process.exit(1)
  }

  log("validation passed:", validationResult.summary)

  // If validate-only mode, exit here
  if (validateOnly) {
    log("validation-only mode: exiting successfully")
    process.exit(0)
  }

  // 2) Fetch current ETH price for USD calculations
  const ethPrice = await fetchETHPrice()
  log("ETH price:", ethPrice ? `$${ethPrice}` : "unavailable")

  const rows = []
  for (const ev of events) {
    try {
      const ts = Number(ev.timestamp || ev.timestampMs || ev.ts || 0)
      const wallet = (
        ev.ethAddress ||
        ev.wallet ||
        ev.address ||
        ""
      ).toLowerCase()
      const amountBase = parseAmountBase(ev.amount, ev.decimals)
      const amountUsd = ethPrice ? amountBase * ethPrice : null
      const token = String(ev?.token || "ETH").toUpperCase()
      const asset = token === "WETH" ? "WETH" : "ETH"
      if (!ts || !wallet || !Number.isFinite(amountBase)) continue
      rows.push({
        ts,
        day: toDateUTC(ts),
        wallet,
        amountBase,
        amountUsd,
        asset,
      })
    } catch {}
  }

  // 2) Aggregate daily
  const byDay = new Map()
  for (const r of rows) {
    const e = byDay.get(r.day) || {
      deposits_count: 0,
      deposits_amount_base: 0,
      deposits_amount_usd: 0,
      unique: new Set(),
      usd_seen: false,
    }
    e.deposits_count += 1
    e.deposits_amount_base += r.amountBase
    if (r.amountUsd != null) {
      e.deposits_amount_usd += r.amountUsd
      e.usd_seen = true
    }
    e.unique.add(r.wallet)
    byDay.set(r.day, e)
  }
  const series = Array.from(byDay.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, v]) => ({
      day,
      deposits_count: v.deposits_count,
      deposits_amount_base: Number(v.deposits_amount_base.toFixed(6)),
      deposits_amount_usd: v.usd_seen
        ? Number(v.deposits_amount_usd.toFixed(2))
        : null,
      unique_wallets: v.unique.size,
    }))

  // 3) Write JSON
  const outPath = path.join(REPORT_DIR, "alpha-steth-deposits.json")
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      { updated_at: new Date().toISOString(), series },
      null,
      2
    )
  )
  log("wrote", outPath)

  // 4) Write markdown summary
  const last = series[series.length - 1]
  const last7 = series.slice(-7)
  const prev7 = series.length > 7 ? series.slice(-14, -7) : []
  const sum7 = last7.reduce(
    (a, x) => ({
      count: a.count + x.deposits_count,
      base: a.base + x.deposits_amount_base,
      usd:
        x.deposits_amount_usd != null
          ? (a.usd == null ? 0 : a.usd) + x.deposits_amount_usd
          : a.usd,
    }),
    { count: 0, base: 0, usd: null }
  )
  const sumPrev7 = prev7.reduce(
    (a, x) => ({
      count: a.count + x.deposits_count,
      base: a.base + x.deposits_amount_base,
      usd:
        x.deposits_amount_usd != null
          ? (a.usd == null ? 0 : a.usd) + x.deposits_amount_usd
          : a.usd,
    }),
    { count: 0, base: 0, usd: null }
  )

  // Yesterday granular metrics
  const yesterdayDay = last?.day
  const rowsYesterday = rows.filter((r) => r.day === yesterdayDay)
  const amounts = rowsYesterday
    .map((r) => r.amountBase)
    .sort((a, b) => a - b)
  const avg = amounts.length
    ? amounts.reduce((a, b) => a + b, 0) / amounts.length
    : 0
  const median = amounts.length
    ? amounts.length % 2
      ? amounts[(amounts.length - 1) / 2]
      : (amounts[amounts.length / 2 - 1] +
          amounts[amounts.length / 2]) /
        2
    : 0
  const pIdx = Math.max(0, Math.floor(0.95 * (amounts.length - 1)))
  const p95 = amounts.length ? amounts[pIdx] : 0

  // New vs returning depositors
  const walletsYesterday = new Set(rowsYesterday.map((r) => r.wallet))
  const walletsBefore = new Set(
    rows.filter((r) => r.day < yesterdayDay).map((r) => r.wallet)
  )
  let newCount = 0
  for (const w of walletsYesterday)
    if (!walletsBefore.has(w)) newCount++
  const returningCount = Math.max(0, walletsYesterday.size - newCount)

  // Top 3 deposits
  const top3 = rowsYesterday
    .slice()
    .sort((a, b) => b.amountBase - a.amountBase)
    .slice(0, 3)
    .map((r) => ({
      amount: r.amountBase,
      wallet: `${r.wallet.slice(0, 6)}…${r.wallet.slice(-4)}`,
    }))

  // Hour histogram (UTC)
  const byHour = new Map(Array.from({ length: 24 }, (_, h) => [h, 0]))
  for (const r of rowsYesterday) {
    const h = new Date(r.ts).getUTCHours()
    byHour.set(h, (byHour.get(h) || 0) + 1)
  }
  const topHours = Array.from(byHour.entries())
    .filter(([, c]) => c > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([h, c]) => `${h}(${c})`)

  // 7d deltas and trend
  const avg7 = last7.length ? sum7.count / last7.length : 0
  const deltaCount = last ? last.deposits_count - avg7 : 0
  const deltaPct = avg7 > 0 ? (deltaCount / avg7) * 100 : 0
  const baseChangePct =
    sumPrev7.base > 0
      ? ((sum7.base - sumPrev7.base) / sumPrev7.base) * 100
      : 0
  const trendEmoji =
    sumPrev7.base === 0
      ? "→"
      : baseChangePct >= 5
      ? "↑"
      : baseChangePct <= -5
      ? "↓"
      : "→"

  // Alerts
  const alerts = []
  const whaleThreshold = Number(process.env.ALERT_WHALE_ETH || 25)
  const maxDeposit = amounts.length ? Math.max(...amounts) : 0
  if (last && last.deposits_count < avg7 * 0.7)
    alerts.push("volume down")
  if (maxDeposit >= whaleThreshold)
    alerts.push(`whale ≥ ${whaleThreshold} ETH`)
  if (newCount === 0 && walletsYesterday.size > 0)
    alerts.push("no new users")

  // Markdown report (extended)
  const last30 = series.slice(-30)
  const table30 =
    "\n\nLast 30 days:\n\n| day | count | base ETH | unique |\n|---|---:|---:|---:|\n" +
    last30
      .map(
        (d) =>
          `| ${d.day} | ${
            d.deposits_count
          } | ${d.deposits_amount_base.toFixed(6)} | ${
            d.unique_wallets
          } |`
      )
      .join("\n")

  const md = `# Alpha stETH – Deposits (MVP)\n\nUpdated: ${new Date().toISOString()}\n\nLatest day: ${
    last ? last.day : "n/a"
  }\n- deposits_count: ${
    last ? last.deposits_count : 0
  } (vs 7d avg: ${avg7.toFixed(2)}, ${
    deltaPct >= 0 ? "+" : ""
  }${deltaPct.toFixed(1)}%)\n- deposits_amount_base: ${
    last ? last.deposits_amount_base.toFixed(6) : 0
  }\n- unique_wallets: ${
    last ? last.unique_wallets : 0
  } (new: ${newCount}, returning: ${returningCount})\n- avg/median/p95: ${avg.toFixed(
    4
  )} / ${median.toFixed(4)} / ${p95.toFixed(
    4
  )} ETH\n\nLast 7 days totals:\n- count: ${
    sum7.count
  }\n- base: ${sum7.base.toFixed(6)} (vs prev 7d: ${
    baseChangePct >= 0 ? "+" : ""
  }${baseChangePct.toFixed(
    1
  )}% ${trendEmoji})\n\nTop deposits (yday): ${
    top3.length
      ? top3
          .map((t) => `${t.amount.toFixed(4)} ${t.wallet}`)
          .join(", ")
      : "n/a"
  }\nBusy hours UTC (yday): ${
    topHours.join(", ") || "n/a"
  }${table30}\n\nSee JSON time series: public/reports/alpha-steth-deposits.json\n`
  fs.writeFileSync(DOCS_MD, md)
  log("wrote", DOCS_MD)

  // 5) Telegram message (optional)
  if (
    TG_TOKEN &&
    TG_CHAT &&
    last &&
    (postTelegram || !validateOnly)
  ) {
    // Normalize events once to avoid timestamp collisions and compute per-asset splits directly
    const norm = events
      .map((ev) => {
        const ts = Number(
          ev.timestamp || ev.timestampMs || ev.ts || 0
        )
        const assetRaw = String(ev?.token || "ETH").toUpperCase()
        const asset = assetRaw === "WETH" ? "WETH" : "ETH"
        const amountBase = parseAmountBase(ev.amount, ev.decimals)
        return {
          ts,
          day: toDateUTC(ts),
          amountBase,
          amountUsd: ethPrice ? amountBase * ethPrice : null,
          asset,
        }
      })
      .filter((e) => Number.isFinite(e.ts) && e.ts > 0)

    // ALL totals
    const allTotals = norm.reduce(
      (acc, r) => {
        acc.count += 1
        acc.base += r.amountBase || 0
        if (r.amountUsd != null)
          acc.usd = (acc.usd == null ? 0 : acc.usd) + r.amountUsd
        const cur = acc.assets[r.asset] || { count: 0, base: 0 }
        cur.count += 1
        cur.base += r.amountBase || 0
        acc.assets[r.asset] = cur
        return acc
      },
      { count: 0, base: 0, usd: null, assets: {} }
    )

    // BY DAY (last 30d) with per-asset split
    const byDayAssets = new Map()
    for (const r of norm) {
      const d = byDayAssets.get(r.day) || {
        count: 0,
        base: 0,
        usd: null,
        assets: {
          ETH: { count: 0, base: 0 },
          WETH: { count: 0, base: 0 },
        },
      }
      d.count += 1
      d.base += r.amountBase || 0
      if (r.amountUsd != null)
        d.usd = (d.usd == null ? 0 : d.usd) + r.amountUsd
      d.assets[r.asset].count += 1
      d.assets[r.asset].base += r.amountBase || 0
      byDayAssets.set(r.day, d)
    }
    const dayLines = Array.from(byDayAssets.entries())
      .sort((a, b) => b[0].localeCompare(a[0])) // Most recent first (reverse chronological order)
      .slice(0, 30) // Take first 30 (most recent 30 days)
      .map(([day, v]) => {
        const eth = v.assets.ETH
        const weth = v.assets.WETH
        const usdStr =
          v.usd != null ? ` (≈ $${v.usd.toFixed(2)})` : ""
        return `${day}: ${v.count} | ${v.base.toFixed(
          6
        )} ETH${usdStr} | ETH ${eth.count}/${eth.base.toFixed(
          2
        )}, WETH ${weth.count}/${weth.base.toFixed(2)}`
      })

    const today = new Date().toISOString().slice(0, 10)
    const header = `Alpha stETH — Deposits (${today}, UTC)`
    const allUsdStr =
      allTotals.usd != null ? ` (≈ $${allTotals.usd.toFixed(2)})` : ""
    const allLine = `ALL: ${
      allTotals.count
    } | ${allTotals.base.toFixed(6)} ETH${allUsdStr} | ETH ${
      allTotals.assets.ETH?.count || 0
    }/${(allTotals.assets.ETH?.base || 0).toFixed(2)}, WETH ${
      allTotals.assets.WETH?.count || 0
    }/${(allTotals.assets.WETH?.base || 0).toFixed(2)}`
    const byDayHeader = `\n\nBY DAY (last 30d)`
    const text = [header, allLine, byDayHeader, ...dayLines].join(
      "\n"
    )

    try {
      const r = await fetch(
        `https://api.telegram.org/bot${TG_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ chat_id: TG_CHAT, text }),
        }
      )
      log("telegram status", r.status)
    } catch (e) {
      log("telegram error", e.message)
    }
  }
}

main().catch((e) => {
  console.error(e)
  // do not fail CI for missing data; treat as no-op
  process.exit(0)
})

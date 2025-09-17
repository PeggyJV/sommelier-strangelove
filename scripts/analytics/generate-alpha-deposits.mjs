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

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_BASE =
  process.env.REPORT_API_BASE || process.env.NEXT_PUBLIC_SITE_URL ||
  "https://app.somm.finance"
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

function parseAmountBase(amount, decimals) {
  if (amount == null) return 0
  const s = String(amount)
  // If looks like integer and decimals provided, scale down
  if (/^\d+$/.test(s) && typeof decimals === "number" && decimals > 0) {
    const n = Number(s)
    if (!Number.isFinite(n)) return 0
    return n / Math.pow(10, decimals)
  }
  const n = Number(s)
  return Number.isFinite(n) ? n : 0
}

function toDateUTC(tsMs) {
  const d = new Date(tsMs)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}

async function main() {
  // Ensure dirs
  fs.mkdirSync(REPORT_DIR, { recursive: true })
  fs.mkdirSync(path.dirname(DOCS_MD), { recursive: true })

  // 1) Pull deposit entries from API and normalize
  const events = await fetchDepositsAll(20000)
  if (!events.length) {
    log("no deposit events from API; exiting 0")
    return
  }

  const rows = []
  for (const ev of events) {
    try {
      const ts = Number(ev.timestamp || ev.timestampMs || ev.ts || 0)
      const wallet = (ev.ethAddress || ev.wallet || ev.address || "").toLowerCase()
      const amountBase = parseAmountBase(ev.amount, ev.decimals)
      const amountUsd = ev.amount_usd != null ? Number(ev.amount_usd) : null
      if (!ts || !wallet || !Number.isFinite(amountBase)) continue
      rows.push({ ts, day: toDateUTC(ts), wallet, amountBase, amountUsd })
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
  const amounts = rowsYesterday.map((r) => r.amountBase).sort((a, b) => a - b)
  const avg = amounts.length
    ? amounts.reduce((a, b) => a + b, 0) / amounts.length
    : 0
  const median = amounts.length
    ? (amounts.length % 2
        ? amounts[(amounts.length - 1) / 2]
        : (amounts[amounts.length / 2 - 1] + amounts[amounts.length / 2]) / 2)
    : 0
  const pIdx = Math.max(0, Math.floor(0.95 * (amounts.length - 1)))
  const p95 = amounts.length ? amounts[pIdx] : 0

  // New vs returning depositors
  const walletsYesterday = new Set(rowsYesterday.map((r) => r.wallet))
  const walletsBefore = new Set(rows.filter((r) => r.day < yesterdayDay).map((r) => r.wallet))
  let newCount = 0
  for (const w of walletsYesterday) if (!walletsBefore.has(w)) newCount++
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
    sumPrev7.base > 0 ? ((sum7.base - sumPrev7.base) / sumPrev7.base) * 100 : 0
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
  if (last && last.deposits_count < avg7 * 0.7) alerts.push("volume down")
  if (maxDeposit >= whaleThreshold) alerts.push(`whale ≥ ${whaleThreshold} ETH`)
  if (newCount === 0 && walletsYesterday.size > 0) alerts.push("no new users")

  // Markdown report (extended)
  const last30 = series.slice(-30)
  const table30 =
    "\n\nLast 30 days:\n\n| day | count | base ETH | unique |\n|---|---:|---:|---:|\n" +
    last30
      .map(
        (d) =>
          `| ${d.day} | ${d.deposits_count} | ${d.deposits_amount_base.toFixed(
            6
          )} | ${d.unique_wallets} |`
      )
      .join("\n")

  const md = `# Alpha stETH – Deposits (MVP)\n\nUpdated: ${new Date().toISOString()}\n\nLatest day: ${
    last ? last.day : "n/a"
  }\n- deposits_count: ${last ? last.deposits_count : 0} (vs 7d avg: ${
    avg7.toFixed(2)
  }, ${deltaPct >= 0 ? "+" : ""}${deltaPct.toFixed(1)}%)\n- deposits_amount_base: ${
    last ? last.deposits_amount_base.toFixed(6) : 0
  }\n- unique_wallets: ${
    last ? last.unique_wallets : 0
  } (new: ${newCount}, returning: ${returningCount})\n- avg/median/p95: ${avg.toFixed(4)} / ${median.toFixed(4)} / ${p95.toFixed(
    4
  )} ETH\n\nLast 7 days totals:\n- count: ${sum7.count}\n- base: ${sum7.base.toFixed(6)} (vs prev 7d: ${
    baseChangePct >= 0 ? "+" : ""
  }${baseChangePct.toFixed(1)}% ${trendEmoji})\n\nTop deposits (yday): ${
    top3.length
      ? top3.map((t) => `${t.amount.toFixed(4)} ${t.wallet}`).join(", ")
      : "n/a"
  }\nBusy hours UTC (yday): ${topHours.join(", ") || "n/a"}${table30}\n\nSee JSON time series: public/reports/alpha-steth-deposits.json\n`
  fs.writeFileSync(DOCS_MD, md)
  log("wrote", DOCS_MD)

  // 5) Telegram message (optional)
  if (TG_TOKEN && TG_CHAT && last) {
    const text = `Alpha stETH — Daily deposits (${last.day})\n• count: ${
      last.deposits_count
    } (vs 7d avg: ${avg7.toFixed(2)}, ${
      deltaPct >= 0 ? "+" : ""
    }${deltaPct.toFixed(1)}%)\n• sum: ${last.deposits_amount_base.toFixed(6)} ETH\n• unique: ${
      last.unique_wallets
    } | new: ${newCount}, ret: ${returningCount}\n• avg/med/p95: ${avg
      .toFixed(4)
      .replace(/0+$/,'')}/${median.toFixed(4).replace(/0+$/,'')}/${p95
      .toFixed(4)
      .replace(/0+$/,'')} ETH\n• top: ${
      top3.length
        ? top3.map((t) => `${t.amount.toFixed(2)} ${t.wallet}`).join(", ")
        : "n/a"
    }\n• 7d: count ${sum7.count}, sum ${sum7.base.toFixed(2)} (prev7: ${
      baseChangePct >= 0 ? "+" : ""
    }${baseChangePct.toFixed(1)}% ${trendEmoji})\n• busy hrs UTC: ${
      topHours.join(", ") || "n/a"
    }\n\nAlerts: ${alerts.length ? alerts.join(", ") : "none"}`
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

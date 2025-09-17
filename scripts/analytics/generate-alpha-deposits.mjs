/*
  Generates MVP deposits report for Alpha stETH from Upstash Redis (snapshot).
  Reads keys by prefix and writes:
  - public/reports/alpha-steth-deposits.json (daily time series)
  - docs/analytics/mvp-deposits.md (brief markdown summary)
  Optionally posts a Telegram message if BOT_TOKEN + CHAT_ID are present.
  This script is conservative: if env is missing, it exits 0 without failing CI.
*/
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const REST_URL = process.env.UPSTASH_REDIS_REST_URL
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
const TG_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TG_CHAT = process.env.TELEGRAM_CHAT_ID

const REPORT_DIR = path.join(process.cwd(), 'public', 'reports')
const DOCS_MD = path.join(process.cwd(), 'docs', 'analytics', 'mvp-deposits.md')

function log(...args) {
  console.log('[alpha-deposits]', ...args)
}

async function upstashFetch(route, init = {}) {
  if (!REST_URL || !REST_TOKEN) {
    log('Upstash env missing; skipping fetch')
    return null
  }
  const url = `${REST_URL}${route}`
  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${REST_TOKEN}`,
      'Content-Type': 'application/json',
      ...(init.headers || {})
    }
  })
  if (!res.ok) throw new Error(`Upstash error ${res.status}`)
  return res.json()
}

// Simple SCAN using Upstash REST API
async function scanPrefix(prefix, limit = 5000) {
  // Upstash JSON API: /scan?prefix=...&cursor=0
  let cursor = 0
  const keys = []
  do {
    const q = `?prefix=${encodeURIComponent(prefix)}&cursor=${cursor}`
    const data = await upstashFetch(`/scan${q}`)
    if (!data) break
    cursor = data.cursor
    keys.push(...(data.keys || []))
    if (keys.length >= limit) break
  } while (cursor && cursor !== 0)
  return keys.slice(0, limit)
}

async function getJSON(key) {
  const res = await upstashFetch(`/get/${encodeURIComponent(key)}`)
  if (res && typeof res.result === 'string') {
    try { return JSON.parse(res.result) } catch {}
  }
  return null
}

function toDateUTC(tsMs) {
  const d = new Date(tsMs)
  return d.toISOString().slice(0,10) // YYYY-MM-DD
}

async function main() {
  // Ensure dirs
  fs.mkdirSync(REPORT_DIR, { recursive: true })
  fs.mkdirSync(path.dirname(DOCS_MD), { recursive: true })

  // 1) Pull deposit entries
  const prefix = 'tx:alpha-steth:deposit:'
  let keys = []
  try {
    keys = await scanPrefix(prefix, 10000)
  } catch (e) {
    log('scan failed (ok for first run):', e.message)
  }

  const rows = []
  for (const k of keys) {
    try {
      const v = await getJSON(k)
      if (!v) continue
      const ts = Number(v.timestamp || v.ts || 0)
      const wallet = v.wallet || v.address
      const amountBase = Number(v.amount_base || v.amount || 0)
      const amountUsd = v.amount_usd != null ? Number(v.amount_usd) : null
      if (!ts || !wallet || !Number.isFinite(amountBase)) continue
      rows.push({ ts, day: toDateUTC(ts), wallet, amountBase, amountUsd })
    } catch {}
  }

  // 2) Aggregate daily
  const byDay = new Map()
  for (const r of rows) {
    const e = byDay.get(r.day) || { deposits_count: 0, deposits_amount_base: 0, deposits_amount_usd: 0, unique: new Set() }
    e.deposits_count += 1
    e.deposits_amount_base += r.amountBase
    if (r.amountUsd != null) e.deposits_amount_usd += r.amountUsd
    e.unique.add(r.wallet)
    byDay.set(r.day, e)
  }
  const series = Array.from(byDay.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([day, v]) => ({
    day,
    deposits_count: v.deposits_count,
    deposits_amount_base: Number(v.deposits_amount_base.toFixed(6)),
    deposits_amount_usd: Number(v.deposits_amount_usd.toFixed(2)) || null,
    unique_wallets: v.unique.size
  }))

  // 3) Write JSON
  const outPath = path.join(REPORT_DIR, 'alpha-steth-deposits.json')
  fs.writeFileSync(outPath, JSON.stringify({ updated_at: new Date().toISOString(), series }, null, 2))
  log('wrote', outPath)

  // 4) Write markdown summary
  const last = series[series.length - 1]
  const last7 = series.slice(-7)
  const sum7 = last7.reduce((a, x) => ({
    count: a.count + x.deposits_count,
    base: a.base + x.deposits_amount_base,
    usd: a.usd + (x.deposits_amount_usd || 0)
  }), { count: 0, base: 0, usd: 0 })
  const md = `# Alpha stETH – Deposits (MVP)\n\nUpdated: ${new Date().toISOString()}\n\nLatest day: ${last ? last.day : 'n/a'}\n- deposits_count: ${last ? last.deposits_count : 0}\n- deposits_amount_base: ${last ? last.deposits_amount_base.toFixed(6) : 0}\n- deposits_amount_usd: ${last && last.deposits_amount_usd != null ? last.deposits_amount_usd.toFixed(2) : 'n/a'}\n- unique_wallets: ${last ? last.unique_wallets : 0}\n\nLast 7 days totals:\n- count: ${sum7.count}\n- base: ${sum7.base.toFixed(6)}\n- usd: ${sum7.usd ? sum7.usd.toFixed(2) : 'n/a'}\n\nSee JSON time series: public/reports/alpha-steth-deposits.json\n`
  fs.writeFileSync(DOCS_MD, md)
  log('wrote', DOCS_MD)

  // 5) Telegram message (optional)
  if (TG_TOKEN && TG_CHAT && last) {
    const text = `Alpha stETH deposits (yesterday ${last.day})\n• count: ${last.deposits_count}\n• sum: ${last.deposits_amount_base.toFixed(6)} ETH\n• unique: ${last.unique_wallets}`
    try {
      const r = await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ chat_id: TG_CHAT, text })
      })
      log('telegram status', r.status)
    } catch (e) {
      log('telegram error', e.message)
    }
  }
}

main().catch((e) => {
  console.error(e)
  // do not fail CI for missing data; treat as no-op
  process.exit(0)
})



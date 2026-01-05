#!/usr/bin/env node
/**
 * Lightweight API sanity script.
 * Calls the same endpoints the app uses and prints counts + TVL sums.
 */
const BASE = process.env.API_BASE || "https://api.sommelier.finance"
const SAMPLE_VAULT =
  process.env.SAMPLE_VAULT ||
  "0xb5b29320d2Dde5BA5BAFA1EbcD270052070483ec" // Real Yield ETH

const fetchJson = async (label, url) => {
  const res = await fetch(url)
  const body = await res.json().catch(() => ({}))
  const size = JSON.stringify(body).length
  console.log(`[${label}] status=${res.status} bytes=${size}`)
  return body
}

const sumDailyTvl = (daily) => {
  const perVault = Object.entries(daily.Response || {}).map(
    ([addr, entries]) => {
      if (!Array.isArray(entries) || entries.length === 0) return 0
      const latest = entries.reduce((acc, cur) =>
        (cur?.unix_seconds ?? 0) > (acc?.unix_seconds ?? 0) ? cur : acc
      )
      const tvl = Number(latest?.tvl ?? 0)
      return Number.isFinite(tvl) ? tvl : 0
    }
  )
  return perVault.reduce((a, b) => a + b, 0)
}

const main = async () => {
  const now = new Date()
  const monthAgo = new Date()
  monthAgo.setDate(now.getDate() - 31)
  monthAgo.setHours(0, 0, 0, 0)
  const from = Math.floor(monthAgo.getTime() / 1000)

  const tvl = await fetchJson("tvl", `${BASE}/tvl`)
  const dailyEth = await fetchJson(
    "daily-eth",
    `${BASE}/dailyData/ethereum/allCellars/${from}/latest`
  )
  const dailyArb = await fetchJson(
    "daily-arb",
    `${BASE}/dailyData/arbitrum/allCellars/${from}/latest`
  )
  const dailyOpt = await fetchJson(
    "daily-opt",
    `${BASE}/dailyData/optimism/allCellars/${from}/latest`
  )
  const snapshot = await fetchJson(
    "snapshot",
    `${BASE}/snapshot/ethereum/${SAMPLE_VAULT}`
  )

  console.log("")
  console.log("Counts")
  console.log({
    tvlKeys: Object.keys(tvl?.Response || {}).length,
    ethCellars: Object.keys(dailyEth?.Response || {}).length,
    arbCellars: Object.keys(dailyArb?.Response || {}).length,
    optCellars: Object.keys(dailyOpt?.Response || {}).length,
  })

  console.log("TVL totals (computed from dailyData)");
  console.log({
    eth: sumDailyTvl(dailyEth),
    arb: sumDailyTvl(dailyArb),
    opt: sumDailyTvl(dailyOpt),
  })

  if (snapshot?.Error) {
    console.log("Snapshot error", snapshot.Error)
  } else {
    console.log("Snapshot sample", snapshot?.Response)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


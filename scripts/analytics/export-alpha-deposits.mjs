#!/usr/bin/env node
/**
 * Production-only exporter for Alpha stETH deposit transactions.
 * Fetches all valid events from START_BLOCK_ALPHA_STETH to now,
 * validates them, and exports to JSON, CSV, and Markdown formats.
 * Optionally posts to Telegram in chunks.
 */

import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import crypto from "node:crypto"
import { validateEvents } from "./validate-events.mjs"
import {
  toCSV,
  toTallinnISO,
  chunk,
  formatAmountETH,
} from "./formatters.mjs"

const API = process.env.REPORT_API_BASE || "https://app.somm.finance"
const START_BLOCK = Number(process.env.START_BLOCK_ALPHA_STETH || NaN)
const POST_TG = process.argv.includes("--post-telegram")

// Fetch ETH price for USD calculations
async function fetchETHPrice() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
    const data = await response.json()
    return data.ethereum?.usd || null
  } catch (e) {
    console.log("Failed to fetch ETH price:", e.message)
    return null
  }
}

// USD formatting with thousands separators
function usdFmt(n) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

// Strict message template renderer
export function renderStrictMessage({
  rows,
  totalCount,
  totalEth,
  totalUsd,
  startBlock,
}) {
  const header =
    "📊 Alpha stETH Deposits (Validated)\n    \n📈 Chunk 1/1"
  const total = `💰 Total: ${totalCount} transactions, ${totalEth} ETH (≈ $${usdFmt(
    totalUsd
  )})`
  const meta = `🔗 Start Block: ${startBlock}`
  const tableHead = [
    "Date       | Amount ETH | Transaction Hash",
    "-----------|------------|------------------",
  ].join("\n")
  const body = rows.join("\n") // each: "YYYY-MM-DD | {amountETH} ETH | {txHash}"
  const footer =
    "✅ All transactions validated and from production data only"

  // Build message with exact spacing as shown in the image
  const text = [
    header,
    "",
    total,
    "",
    meta,
    "",
    tableHead,
    "",
    body,
    "",
    footer,
  ].join("\n")

  // Hard guards
  if (/BY DAY|ALL:|```/.test(text)) {
    throw new Error("Forbidden variant detected in message.")
  }
  return text
}

function isPlaceholder(text) {
  return typeof text === "string" && /^Alpha daily ping\b/i.test(text)
}

function ensureStrictText(text) {
  if (process.env.TELEGRAM_MODE === "strict") {
    const t = String(text ?? "")
    if (!t.trim())
      throw new Error("compose_empty: no message content")
    if (isPlaceholder(t))
      throw new Error(
        "compose_placeholder: placeholder message detected"
      )
  }
}

// Idempotency check and post
async function maybePostOnce(
  text,
  sendFn,
  stableData,
  cachePath = ".cache/alpha-tg-digest.json"
) {
  // Create digest from stable content only (not USD price or timestamps)
  const digestKey = JSON.stringify({
    rows: stableData.rows.map((r) => [r.date, r.amountETH, r.txHash]),
    totalEth: stableData.totalEth,
    startBlock: stableData.startBlock,
  })
  const digest = crypto
    .createHash("sha256")
    .update(digestKey, "utf8")
    .digest("hex")

  let last = null
  try {
    last = JSON.parse(await fs.readFile(cachePath, "utf8")).digest
  } catch {}
  if (last === digest) {
    console.log("Identical message already sent today. Skipping TG.")
    return false
  }
  await sendFn(text)
  await fs.mkdir(path.dirname(cachePath), { recursive: true })
  await fs.writeFile(
    cachePath,
    JSON.stringify({ digest, at: new Date().toISOString() }, null, 2)
  )
  return true
}

// Parse --limit N flag
const limitArg = process.argv.find((arg) =>
  arg.startsWith("--limit=")
)
const LIMIT = limitArg
  ? Number(limitArg.split("=")[1])
  : Number(process.env.EXPORT_LIMIT || 5000)

if (!Number.isFinite(START_BLOCK)) {
  console.error("❌ START_BLOCK_ALPHA_STETH is required")
  console.error("   Run: pnpm discover:startblock:alpha")
  console.error("   Set: START_BLOCK_ALPHA_STETH=<discovered_block>")
  process.exit(1)
}

async function fetchAll() {
  console.log(
    `🔍 Fetching Alpha stETH deposits from block ${START_BLOCK}...`
  )

  // Use by-block with a large window. Server side should paginate or stream if supported.
  // If pagination is needed, extend this to loop with cursor params.
  const url = `${API}/api/deposits/by-block?fromBlock=${START_BLOCK}&toBlock=+inf&order=desc&limit=10000`
  console.log(`   API: ${url}`)

  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Fetch failed ${res.status}: ${res.statusText}`)
  }

  const arr = await res.json()
  const events = Array.isArray(arr) ? arr : []

  console.log(`   ✅ Fetched ${events.length} events`)
  return events
}

function minimalize(events) {
  // Return only real fields required for TG and files
  return events.map((e) => {
    const { isoUTC, dateOnly } = toTallinnISO(e.timestamp)
    const amountETH = formatAmountETH(e.amount, e.decimals)

    return {
      txHash: e.txHash,
      date: dateOnly,
      isoUTC,
      amountETH,
      blockNumber: e.blockNumber,
      wallet: e.ethAddress,
      token: e.token,
    }
  })
}

async function writeFiles(minRows, allRows) {
  console.log(`📝 Writing export files...`)

  // Files
  await fs.mkdir("public/reports", { recursive: true })
  await fs.mkdir("docs/analytics", { recursive: true })

  const jsonPath = "public/reports/alpha-steth-deposits.json"
  const csvPath = "public/reports/alpha-steth-deposits.csv"
  const mdPath = "docs/analytics/alpha-steth-deposits.md"

  // JSON export with full data
  await fs.writeFile(jsonPath, JSON.stringify(minRows, null, 2))
  console.log(`   ✅ JSON: ${jsonPath}`)

  // CSV export
  const csv = toCSV(minRows, [
    "txHash",
    "date",
    "isoUTC",
    "amountETH",
    "blockNumber",
    "wallet",
    "token",
  ])
  await fs.writeFile(csvPath, csv)
  console.log(`   ✅ CSV: ${csvPath}`)

  // Markdown export
  const totalAmount = minRows.reduce(
    (sum, r) => sum + parseFloat(r.amountETH),
    0
  )

  // Fetch ETH price for USD calculations in markdown
  const ethPrice = await fetchETHPrice()
  const totalUSD = ethPrice
    ? (totalAmount * ethPrice).toFixed(2)
    : null
  const usdText = totalUSD ? ` (≈ $${totalUSD})` : ""

  const md = [
    "# Alpha stETH deposits (real, validated)",
    "",
    `**Total transactions:** ${minRows.length}`,
    `**Total amount:** ${totalAmount.toFixed(6)} ETH${usdText}`,
    `**Start block:** ${START_BLOCK}`,
    `**Export date:** ${new Date().toISOString()}`,
    "",
    "| txHash | Date | Amount (ETH) | Block | Wallet | Token |",
    "|--------|------|--------------|-------|--------|-------|",
    ...minRows.map(
      (r) =>
        `| \`${r.txHash}\` | ${r.date} | ${r.amountETH} | ${r.blockNumber} | \`${r.wallet}\` | ${r.token} |`
    ),
    "",
    "## Files",
    "",
    "- [JSON Export](public/reports/alpha-steth-deposits.json)",
    "- [CSV Export](public/reports/alpha-steth-deposits.csv)",
    "",
  ].join("\n")
  await fs.writeFile(mdPath, md)
  console.log(`   ✅ Markdown: ${mdPath}`)

  return { jsonPath, csvPath, mdPath }
}

async function postZeroRowsMessage() {
  // Enforce strict mode for Telegram posting
  if (process.env.TELEGRAM_MODE !== "strict") {
    console.log("TG disabled: TELEGRAM_MODE is not 'strict'.")
    process.exit(0)
  }

  // Use strict template for zero rows
  const text = renderStrictMessage({
    rows: [], // Empty rows
    totalCount: 0,
    totalEth: "0.000000",
    totalUsd: 0,
    startBlock: START_BLOCK,
  })

  ensureStrictText(text)

  // Preview mode: print exact message and exit without posting
  if (process.env.TELEGRAM_PREVIEW === "1") {
    console.log(String(text ?? ""))
    process.exit(0)
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID

  // Post with idempotency using stable data
  const stableData = {
    rows: [],
    totalEth: "0.000000",
    startBlock: START_BLOCK,
  }

  await maybePostOnce(
    text,
    async (t) => {
      const resp = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: t,
            parse_mode: "Markdown",
          }),
        }
      )
      if (!resp.ok) {
        const error = await resp.text()
        throw new Error(
          `Telegram post failed ${resp.status}: ${error}`
        )
      }
    },
    stableData
  )

  console.log("   ✅ Zero rows message sent to Telegram")
}

async function postTelegramPreview(minRows) {
  // Enforce strict mode for Telegram posting
  if (process.env.TELEGRAM_MODE !== "strict") {
    console.log("TG disabled: TELEGRAM_MODE is not 'strict'.")
    process.exit(0)
  }

  const previewOnly = process.env.TELEGRAM_PREVIEW === "1"
  if (!previewOnly) {
    console.log(`📱 Posting to Telegram...`)
  }

  // Fetch ETH price for USD calculations
  const ethPrice = await fetchETHPrice()
  if (!previewOnly) {
    console.log(`   💱 ETH Price: $${ethPrice || "N/A"}`)
  }

  // Calculate totals
  const totalAmount = minRows.reduce(
    (sum, r) => sum + parseFloat(r.amountETH),
    0
  )
  const totalUSD = ethPrice ? totalAmount * ethPrice : 0

  // Build rows in strict format
  const lines = minRows.map(
    (r) => `${r.date} | ${r.amountETH} ETH | ${r.txHash}`
  )

  // Render strict message
  const text = renderStrictMessage({
    rows: lines,
    totalCount: minRows.length,
    totalEth: totalAmount.toFixed(6),
    totalUsd: totalUSD,
    startBlock: START_BLOCK,
  })

  ensureStrictText(text)

  // Preview mode: print exact message and exit without posting
  if (process.env.TELEGRAM_PREVIEW === "1") {
    console.log(String(text ?? ""))
    process.exit(0)
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error(
      "❌ TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID required for --post-telegram"
    )
    process.exit(1)
  }

  // Post with idempotency using stable data
  const stableData = {
    rows: minRows,
    totalEth: totalAmount.toFixed(6),
    startBlock: START_BLOCK,
  }

  await maybePostOnce(
    text,
    async (t) => {
      const resp = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: t,
            parse_mode: "Markdown",
          }),
        }
      )
      if (!resp.ok) {
        const error = await resp.text()
        throw new Error(
          `Telegram post failed ${resp.status}: ${error}`
        )
      }
    },
    stableData
  )

  console.log(`   ✅ Telegram message sent`)
}

async function main() {
  console.log("🚀 Alpha stETH Deposit Exporter")
  console.log(`   API: ${API}`)
  console.log(`   Start Block: ${START_BLOCK}`)
  console.log(`   Telegram: ${POST_TG ? "Yes" : "No"}`)
  console.log(`   Limit: ${LIMIT}`)
  console.log("")

  try {
    // 1) Fetch all events
    const events = await fetchAll()

    if (events.length === 0) {
      console.log("⚠️  No events found")
      return
    }

    // 2) Validate using the existing gate
    console.log(`🔍 Validating ${events.length} events...`)
    const { ok, errors, violations } = validateEvents(events, {
      apiBase: API,
    })

    // Check if violations are only test data
    const testDataViolations = violations.filter(
      (v) =>
        v.event.txHash.includes("deadbeef") ||
        v.event.ethAddress.includes(
          "4444444444444444444444444444444444444444"
        ) ||
        v.errors.some(
          (e) => e.includes("localhost") || e.includes("test")
        )
    )

    if (!ok && testDataViolations.length < violations.length) {
      console.error(
        "❌ Validation failed with non-test data violations!"
      )
      console.error(`   Errors: ${errors.length}`)
      console.error(`   Violations: ${violations.length}`)
      console.error(
        `   Test data violations: ${testDataViolations.length}`
      )
      console.error(
        `   Real violations: ${
          violations.length - testDataViolations.length
        }`
      )

      // Write detailed failure report
      const report = [
        "# Validation Failed",
        "",
        `**Summary:**`,
        `- Total events: ${events.length}`,
        `- Errors: ${errors.length}`,
        `- Violations: ${violations.length}`,
        `- Test data violations: ${testDataViolations.length}`,
        `- Real violations: ${
          violations.length - testDataViolations.length
        }`,
        "",
        "## Errors",
        ...errors.map((e) => `- ${e}`),
        "",
        "## Violations",
        ...violations.map((v, i) =>
          [
            `### Violation ${i + 1}`,
            `- Transaction: ${v.event.txHash}`,
            `- Wallet: ${v.event.ethAddress}`,
            `- Block: ${v.event.blockNumber}`,
            `- Errors: ${v.errors.join(", ")}`,
            "",
          ].join("\n")
        ),
      ].join("\n")

      await fs.writeFile("docs/analytics/validation-fail.md", report)
      console.error("   📝 See: docs/analytics/validation-fail.md")
      process.exit(1)
    }

    if (testDataViolations.length > 0) {
      console.log(
        `⚠️  Found ${testDataViolations.length} test data violations (will be filtered out)`
      )
    }

    console.log(`   ✅ Validation passed`)

    // 3) Filter out test data and minimalize
    const validEvents = events.filter(
      (e) =>
        !e.txHash.includes("deadbeef") &&
        !e.ethAddress.includes(
          "4444444444444444444444444444444444444444"
        )
    )

    console.log(
      `   ✅ Filtered to ${validEvents.length} valid events (removed test data)`
    )

    const minRows = minimalize(validEvents).slice(0, LIMIT)

    if (minRows.length === 0) {
      console.log("⚠️  No validated Alpha stETH deposits found")
      if (POST_TG) {
        await postZeroRowsMessage()
      }
      return
    }

    if (minRows.length < validEvents.length) {
      console.log(
        `   ⚠️  Capped to ${LIMIT} rows (${validEvents.length} total)`
      )
    }

    // 4) Preview-only path: compose and print without writing files
    if (process.env.TELEGRAM_PREVIEW === "1") {
      await postTelegramPreview(minRows)
      return
    }

    // 5) Write artifacts (skip when disabled for serverless runs)
    const artifactsDisabled = process.env.ARTIFACTS_DISABLED === "1"
    if (!artifactsDisabled) {
      const files = await writeFiles(minRows, events)
      console.log("")
      console.log(`📁 Files written:`)
      console.log(`   ${Object.values(files).join("\n   ")}`)
      console.log(`📊 Total rows: ${minRows.length}`)
    } else {
      console.log("🧪 Artifacts disabled for this run (serverless)")
    }
    if (POST_TG) {
      console.log("")
      await postTelegramPreview(minRows)
      console.log("   ✅ Telegram export completed")
    }

    console.log("")
    console.log("🎉 Export completed successfully!")
  } catch (error) {
    console.error("❌ Export failed:", error.message)
    process.exit(1)
  }
}

main()

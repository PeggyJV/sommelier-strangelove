import { loadEnv } from "../env/env.schema.mts"
import { toTallinnISO } from "../analytics/formatters.mjs"
import process from "node:process"

const env = loadEnv()

const TELEGRAM_BOT_TOKEN = String(env.TELEGRAM_BOT_TOKEN)
const TELEGRAM_CHAT_ID = String(env.TELEGRAM_CHAT_ID)

function logStart() {
  const now = new Date()
  const { isoUTC } = toTallinnISO(now.toISOString())
  console.log(
    `Daily sender start UTC=${now.toISOString()} Tallinn=${isoUTC}`
  )
  console.log(`Chat ID: ${TELEGRAM_CHAT_ID}`)
}

async function main() {
  logStart()
  // Reuse existing exporter with posting to ensure a single source of truth
  process.env.TELEGRAM_MODE = "strict"
  const mod = await import("../analytics/export-alpha-deposits.mjs")
  if (!mod) throw new Error("Failed to load exporter")
}

main().catch((e) => {
  console.error("Daily sender failed:", e)
  process.exit(1)
})

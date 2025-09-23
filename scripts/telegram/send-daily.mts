import { loadEnv } from "../env/env.schema.mts"
import { toTallinnISO } from "../analytics/formatters.mjs"
import process from "node:process"
import { spawn } from "node:child_process"

const env = loadEnv()

const TELEGRAM_BOT_TOKEN = String(env.TELEGRAM_BOT_TOKEN)
const TELEGRAM_CHAT_ID = String(env.TELEGRAM_CHAT_ID)
const ENV_MODE = (process.env.ENV_MODE || "live").toLowerCase()

function logStart() {
  const now = new Date()
  const { isoUTC } = toTallinnISO(now.toISOString())
  console.log(
    `Daily sender start UTC=${now.toISOString()} Tallinn=${isoUTC}`
  )
  console.log(`Chat ID: ${TELEGRAM_CHAT_ID}`)
  console.log(`Mode: ${ENV_MODE}`)
}

async function main() {
  logStart()
  // Reuse existing exporter; live mode posts, dry mode only writes files
  const args = [
    "scripts/analytics/export-alpha-deposits.mjs",
    ...(ENV_MODE === "live" ? ["--post-telegram"] : []),
  ]
  const child = spawn(process.execPath, args, {
    stdio: "inherit",
    env: {
      ...process.env,
      TELEGRAM_MODE: ENV_MODE === "live" ? "strict" : "off",
    },
  })
  await new Promise<void>((resolve, reject) => {
    child.on("exit", (code) => {
      if (code === 0) return resolve()
      reject(new Error(`export-alpha-deposits exited with ${code}`))
    })
    child.on("error", reject)
  })
}

main().catch((e) => {
  console.error("Daily sender failed:", e)
  process.exit(1)
})

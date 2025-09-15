import fs from "fs"
import os from "os"
import path from "path"
import fetch from "node-fetch"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env.vercel") })

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")

const ACCESS_KEY = process.env.DEBANK_ACCESS_KEY
if (!ACCESS_KEY) throw new Error("Missing DEBANK_ACCESS_KEY in env")

const LOG_DIR = path.join(
  os.homedir(),
  "Desktop",
  "on-chain-marketing",
  "logs"
)
fs.mkdirSync(LOG_DIR, { recursive: true })

const COMBINED_FILE =
  process.env.COMBINED_FILE || path.join(OUT_DIR, "combined_top_100.csv")

// Provided message content
const MESSAGE_TEXT =
  "Thanks for using Somm vaults. Alpha stETH is our upgraded, even more adaptive stETH strategy. Be early and migrate in a click: https://app.somm.finance/strategies/alpha-steth/manage?src=debank_active_b"

async function groupSend(addresses: string[]) {
  const body: any = {
    address_list: addresses,
    content: {
      type: "text",
      value: {
        url: "https://app.somm.finance/strategies/alpha-steth/manage?src=debank_active_b",
        data: MESSAGE_TEXT,
        version: "v1",
      },
    },
  }

  const res = await fetch(
    "https://pro-openapi.debank.com/v1/official/group_send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        AccessKey: ACCESS_KEY as string,
      },
      body: JSON.stringify(body),
    }
  )

  const json = await res.json().catch(() => ({}))
  return { status: res.status, json }
}

function loadCombined(): string[] {
  const raw = fs.readFileSync(COMBINED_FILE, "utf8").trim().split(/\r?\n/)
  const header = raw[0]?.toLowerCase() || ""
  const hasHeader = header.includes("wallet")
  const lines = hasHeader ? raw.slice(1) : raw
  return Array.from(new Set(lines.map((s) => s.trim()).filter(Boolean)))
}

;(async () => {
  const list = loadCombined()
  if (!list.length) throw new Error("No wallets in combined_top_100.csv")
  console.log(`Sending to ${list.length} wallets via Debank group_send...`)

  // One batch (100). If needed later, chunk.
  const result = await groupSend(list)
  console.log(result)

  const logPath = path.join(
    LOG_DIR,
    `debank_group_send_combined_${Date.now()}.json`
  )
  fs.writeFileSync(
    logPath,
    JSON.stringify({ request_count: list.length, result }, null, 2)
  )
  console.log("Logged to", logPath)
})().catch((e) => {
  console.error(e)
  process.exit(1)
})



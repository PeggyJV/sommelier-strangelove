import fs from "fs"
import os from "os"
import path from "path"
import fetch from "node-fetch"
import * as dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env.vercel") })

const ACCESS_KEY = process.env.DEBANK_ACCESS_KEY
if (!ACCESS_KEY) throw new Error("Missing DEBANK_ACCESS_KEY in env")

const LOG_DIR = path.join(
  os.homedir(),
  "Desktop",
  "on-chain-marketing",
  "logs"
)
fs.mkdirSync(LOG_DIR, { recursive: true })

// Test wallets (provided by user)
const ADDRESS_LIST = [
  "0x1222f0baA62e2282Bfd01083C7C3732A8c611584",
  "0xC3B356C5E0dA0355560c8f2E4189Fb1c5d2981Cd",
]

const MESSAGE_URL =
  "https://app.somm.finance/strategies/alpha-steth/manage?src=debank_test"
const MESSAGE_TEXT =
  "🚀 Test from Somm → Alpha stETH setup. If you receive this, messaging works."
const MAX_OFFER_PRICE = Number(
  process.env.DEBANK_MAX_OFFER_PRICE ?? "10000"
) // $1 default (×10^4)
const PREPAYMENT_AMOUNT = process.env.DEBANK_PREPAYMENT_AMOUNT
  ? Number(process.env.DEBANK_PREPAYMENT_AMOUNT)
  : undefined

async function groupSend(addresses: string[]) {
  const body: any = {
    address_list: addresses,
    content: {
      type: "text",
      value: {
        url: MESSAGE_URL,
        data: MESSAGE_TEXT,
        version: "v1",
      },
    },
    max_offer_price: MAX_OFFER_PRICE,
  }
  if (PREPAYMENT_AMOUNT !== undefined)
    body.prepayment_amount = PREPAYMENT_AMOUNT

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

;(async () => {
  console.log(
    `Sending to ${ADDRESS_LIST.length} wallets via group_send...`
  )
  const result = await groupSend(ADDRESS_LIST)
  console.log(result)

  const logPath = path.join(
    LOG_DIR,
    `debank_group_send_${Date.now()}.json`
  )
  fs.writeFileSync(
    logPath,
    JSON.stringify(
      { request_count: ADDRESS_LIST.length, result },
      null,
      2
    )
  )
  console.log("Logged to", logPath)
})()

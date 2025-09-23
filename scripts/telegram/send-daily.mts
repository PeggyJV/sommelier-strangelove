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
  // Wrap global fetch to log Telegram responses and provide minimal retry/trim
  const originalFetch: typeof fetch = globalThis.fetch as any
  globalThis.fetch = (async (input: any, init?: any) => {
    const url = typeof input === "string" ? input : input?.url
    const isTelegram = typeof url === "string" && url.includes("api.telegram.org") && url.includes("/sendMessage")
    if (!isTelegram) {
      return originalFetch(input as any, init)
    }
    try {
      let bodyObj: any = {}
      if (init?.body) {
        try { bodyObj = JSON.parse(init.body) } catch {}
      }
      const originalText: string = String(bodyObj?.text ?? "")
      let textToSend = originalText
      const maxLen = 3800
      if (textToSend.length > maxLen) {
        console.log(`Telegram: trimming message ${textToSend.length} -> ${maxLen}`)
        textToSend = textToSend.slice(0, maxLen)
        bodyObj.text = textToSend
        init = { ...(init || {}), body: JSON.stringify(bodyObj) }
      }
      // First attempt (as-is)
      let resp = await originalFetch(input as any, init)
      const status = resp.status
      const ok = resp.ok
      const bodyText = await resp.text()
      console.log(`Telegram HTTP ${status} ok=${ok}`)
      if (ok) {
        // Return a fresh Response so downstream can read
        return new Response(bodyText, { status: resp.status, headers: resp.headers as any })
      }
      // Retry once: plain text, no parse_mode
      console.log("Telegram: retrying once with plain text")
      const retryBody = { chat_id: bodyObj.chat_id, text: textToSend }
      resp = await originalFetch(input as any, {
        ...(init || {}),
        headers: { "content-type": "application/json" },
        body: JSON.stringify(retryBody),
      })
      const retryStatus = resp.status
      const retryOk = resp.ok
      const retryText = await resp.text()
      console.log(`Telegram retry HTTP ${retryStatus} ok=${retryOk}`)
      return new Response(retryText, { status: retryStatus, headers: resp.headers as any })
    } catch (e: any) {
      console.error("Telegram wrapper error:", e?.message || e)
      return originalFetch(input as any, init)
    }
  }) as any
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

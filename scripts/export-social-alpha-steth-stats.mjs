// Export the Alpha STETH stats card (1200x675) to Desktop and /public

import http from "http"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { chromium } from "playwright"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const HOST = process.env.HOST || "http://localhost:3000"
const ROUTE = "/_social/alpha-steth-stats"
const TVL = process.env.TVL || "250M"
const APY = process.env.APY || "12.3"

const DESKTOP_OUT = path.resolve(
  process.env.HOME || process.env.USERPROFILE || "~",
  "Desktop",
  "alpha-steth-stats.png"
)
const PUBLIC_OUT = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "social",
  "alpha-steth-stats.png"
)

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume()
          resolve()
        })
        req.on("error", reject)
        req.end()
      })
      return true
    } catch (_) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  return false
}

async function ensureOutDir(filePath) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

async function ensureServer() {
  const reachable = await waitForServer(HOST)
  if (reachable) return { proc: null, mode: "external" }

  const proc = spawn("bash", ["-lc", "next dev -p 3000"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  })

  const ok = await waitForServer(HOST, 90000)
  if (!ok) throw new Error(`Server not reachable at ${HOST}`)
  return { proc, mode: "spawned" }
}

async function exportCard() {
  await ensureOutDir(DESKTOP_OUT)
  await ensureOutDir(PUBLIC_OUT)
  const { proc } = await ensureServer()
  try {
    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1200, height: 675 },
      deviceScaleFactor: 1,
    })
    const url = `${HOST}${ROUTE}?tvl=${encodeURIComponent(
      TVL
    )}&apy=${encodeURIComponent(APY)}`
    await page.goto(url, { waitUntil: "networkidle" })

    await page.addStyleTag({
      content: `
        *[data-og-logo], .vercel-og-logo, .vercel-analytics-badge, .extension-overlay {
          display: none !important;
        }
      `,
    })

    const handle = await page.$("#og-root")
    const box = handle ? await handle.boundingBox() : null
    const clip = box || { x: 0, y: 0, width: 1200, height: 675 }

    await page.screenshot({
      path: DESKTOP_OUT,
      clip,
      omitBackground: false,
    })
    await page.screenshot({
      path: PUBLIC_OUT,
      clip,
      omitBackground: false,
    })
    await browser.close()

    const s1 = fs.statSync(DESKTOP_OUT)
    const s2 = fs.statSync(PUBLIC_OUT)
    console.log(
      `Stats card exported to ${DESKTOP_OUT} (${
        Math.round(s1.size / 102.4) / 10
      } KB) and ${PUBLIC_OUT} (${
        Math.round(s2.size / 102.4) / 10
      } KB)`
    )
  } finally {
    if (proc) proc.kill()
  }
}

exportCard().catch((err) => {
  console.error(err)
  process.exit(1)
})

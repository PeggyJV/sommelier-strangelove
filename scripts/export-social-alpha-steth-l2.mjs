// Export the Alpha stETH L2 social card to a 1200x675 PNG
// Output: ~/Desktop/alpha-steth-l2.png (default)

import http from "http"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { chromium } from "playwright"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const HOST = process.env.HOST || "http://localhost:3000"
const ROUTE = "/_social/alpha-steth-l2"
// Allow overriding output via env VAR OUT_PATH, else default to user's Desktop
const DEFAULT_DESKTOP = path.resolve(
  process.env.HOME || process.env.USERPROFILE || "~",
  "Desktop",
  "alpha-steth-l2.png"
)
const OUT_PATH = process.env.OUT_PATH
  ? path.resolve(process.env.OUT_PATH)
  : DEFAULT_DESKTOP

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
  await ensureOutDir(OUT_PATH)
  const { proc } = await ensureServer()
  try {
    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1200, height: 675 },
      deviceScaleFactor: 1,
    })
    const url = `${HOST}${ROUTE}`
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
      path: OUT_PATH,
      clip,
      omitBackground: false,
    })
    await browser.close()

    const stats = fs.statSync(OUT_PATH)
    const sizeKb = Math.round(stats.size / 102.4) / 10
    console.log(`Social card exported to ${OUT_PATH} (${sizeKb} KB)`)
  } finally {
    if (proc) proc.kill()
  }
}

exportCard().catch((err) => {
  console.error(err)
  process.exit(1)
})

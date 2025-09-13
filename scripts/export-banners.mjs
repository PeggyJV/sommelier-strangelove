// Export the Alpha stETH banner sandbox to a 1920x1080 PNG
// Output: /public/assets/tutorial/intro-banner.png

import http from "http"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { fileURLToPath } from "url"
import { chromium } from "playwright"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const HOST = process.env.HOST || "http://localhost:3000"
const ROUTE = "/strategies/Alpha-stETH/manage/banners"
const OUT_PATH = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "tutorial",
  "intro-banner.png"
)
const OUTRO_ROUTE = "/_banners/outro"
const OUTRO_PATH = path.resolve(
  __dirname,
  "..",
  "public",
  "assets",
  "tutorial",
  "outro-banner.png"
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

  // If not reachable, start dev server
  const proc = spawn("bash", ["-lc", "next dev -p 3000"], {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "development" },
  })

  const ok = await waitForServer(HOST, 90000)
  if (!ok) throw new Error(`Server not reachable at ${HOST}`)
  return { proc, mode: "spawned" }
}

async function exportBanner() {
  await ensureOutDir(OUT_PATH)
  await ensureOutDir(OUTRO_PATH)
  const { proc } = await ensureServer()
  try {
    const browser = await chromium.launch()
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    })
    const url = `${HOST}${ROUTE}`
    await page.goto(url, { waitUntil: "networkidle" })

    // Clip to the banner container only
    // Remove any unexpected overlays that are not part of our allowed assets
    await page.addStyleTag({
      content: `
      *[data-og-logo],
      .vercel-og-logo,
      .vercel-analytics-badge,
      .extension-overlay,
      [class*="n-logo"],
      [aria-label*="Notion"],
      [aria-label*="Nimbus"] {
        display: none !important;
      }
    `,
    })

    const handle = await page.$("#banner-root")
    const box = handle ? await handle.boundingBox() : null
    const clip = box || { x: 0, y: 0, width: 1920, height: 1080 }
    await page.screenshot({
      path: OUT_PATH,
      clip,
      omitBackground: false,
    })
    const stats = fs.statSync(OUT_PATH)
    const sizeKb = Math.round(stats.size / 102.4) / 10
    console.log(`Banner exported to ${OUT_PATH} (${sizeKb} KB)`) // nice-to-have

    // Export outro as well
    const page2 = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    })
    try {
      await page2.goto(`${HOST}${OUTRO_ROUTE}`, {
        waitUntil: "networkidle",
      })
    } catch {
      // Fallback: some environments may not have the route; skip without failing
      await browser.close()
      const stats2 = fs.statSync(OUT_PATH)
      const sizeKb2 = Math.round(stats2.size / 102.4) / 10
      console.log(
        `Outro route not available; only intro exported (${sizeKb2} KB)`
      )
      return
    }
    await page2.addStyleTag({
      content: `
      *[data-og-logo],
      .vercel-og-logo,
      .vercel-analytics-badge,
      .extension-overlay,
      [class*="n-logo"],
      [aria-label*="Notion"],
      [aria-label*="Nimbus"] {
        display: none !important;
      }
    `,
    })
    const handle2 = await page2.$("#banner-root")
    const box2 = handle2 ? await handle2.boundingBox() : null
    const clip2 = box2 || { x: 0, y: 0, width: 1920, height: 1080 }
    await page2.screenshot({
      path: OUTRO_PATH,
      clip: clip2,
      omitBackground: false,
    })
    await page2.close()
    await browser.close()

    const stats2 = fs.statSync(OUTRO_PATH)
    const sizeKb2 = Math.round(stats2.size / 102.4) / 10
    console.log(`Outro exported to ${OUTRO_PATH} (${sizeKb2} KB)`) // nice-to-have
  } finally {
    if (proc) proc.kill()
  }
}

exportBanner().catch((err) => {
  console.error(err)
  process.exit(1)
})

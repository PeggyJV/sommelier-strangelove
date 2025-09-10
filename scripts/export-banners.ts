import http from "http"
import { spawn } from "child_process"
import path from "path"
import fs from "fs"
import { chromium } from "playwright"

const HOST = process.env.HOST || "http://localhost:3000"
const INTRO_PATH = "/_banners/intro"
const OUTRO_PATH = "/_banners/outro"
const OUT_DIR =
  process.env.OUT_DIR ||
  process.env.OUTPUT_DIR ||
  path.join(process.cwd(), "public", "assets", "tutorial")

async function waitForServer(url: string, timeoutMs = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise<void>((resolve, reject) => {
        const req = http.get(url, (res) => {
          res.resume()
          resolve()
        })
        req.on("error", reject)
        req.end()
      })
      return
    } catch (_) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }
  throw new Error(
    `Server not reachable at ${url} within ${timeoutMs}ms`
  )
}

async function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR))
    fs.mkdirSync(OUT_DIR, { recursive: true })
}

async function screenshotPage(route: string, fileName: string) {
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  })
  const url = `${HOST}${route}`
  await page.goto(url, { waitUntil: "networkidle" })

  // Locate the 1920x1080 container and clip to it
  const handle = await page.$("div[style*='width: 1920px']")
  const box = handle ? await handle.boundingBox() : null
  const clip = box || { x: 0, y: 0, width: 1920, height: 1080 }

  const outPath = path.join(OUT_DIR, fileName)
  await page.screenshot({ path: outPath, clip })
  await browser.close()
  return outPath
}

async function main() {
  await ensureOutDir()

  const isBuild = process.env.BUILD !== "false"
  let proc: any
  try {
    if (isBuild) {
      // Start Next in production mode on port 3000
      proc = spawn("bash", ["-lc", "next start -p 3000"], {
        stdio: "inherit",
        env: process.env,
      })
      await waitForServer(`${HOST}/api/health`, 20000).catch(() =>
        waitForServer(HOST, 20000)
      )
    }

    const intro = await screenshotPage(INTRO_PATH, "intro-banner.png")
    const outro = await screenshotPage(OUTRO_PATH, "outro-banner.png")
    console.log(`Saved intro to ${intro}`)
    console.log(`Saved outro to ${outro}`)
  } finally {
    if (proc) {
      proc.kill()
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

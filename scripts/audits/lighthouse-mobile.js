const fs = require("fs")
const path = require("path")
const { spawn } = require("child_process")

const BASE = process.env.MOBILE_AUDIT_BASE_URL || "http://localhost:3000"
const OUT_DIR = path.join(process.cwd(), "audits", "mobile")
const ROUTES = [
  "/",
  "/strategies",
  "/strategies/Alpha-stETH",
  "/strategies/Alpha-stETH/manage",
]

function runLighthouse(url, outPath) {
  return new Promise((resolve, reject) => {
    const lhBin = path.join(
      process.cwd(),
      "node_modules",
      ".bin",
      process.platform === "win32" ? "lighthouse.cmd" : "lighthouse"
    )

    const args = [
      url,
      "--quiet",
      "--output=json",
      `--output-path=${outPath}`,
      "--only-categories=performance,accessibility,best-practices",
      "--emulated-form-factor=mobile",
      "--throttling.rttMs=150",
      "--throttling.throughputKbps=1638",
      "--throttling.cpuSlowdownMultiplier=4",
      "--chrome-flags=--headless=new --no-sandbox",
    ]

    const child = spawn(lhBin, args, { stdio: "inherit" })
    child.on("error", reject)
    child.on("exit", (code) => {
      if (code === 0) return resolve()
      reject(new Error(`lighthouse exited with code ${code}`))
    })
  })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const out = {}
  for (const r of ROUTES) {
    const url = BASE + r
    const safeName = (r.replace(/\W+/g, "_").replace(/^_+|_+$/g, "") || "home")
    const outPath = path.join(OUT_DIR, `${safeName}.json`)
    try {
      await runLighthouse(url, outPath)
      const lhr = JSON.parse(fs.readFileSync(outPath, "utf8"))
      out[r] = {
        requestedUrl: lhr.requestedUrl,
        finalUrl: lhr.finalDisplayedUrl || lhr.finalUrl,
        categories: {
          performance: lhr.categories?.performance?.score ?? null,
          accessibility: lhr.categories?.accessibility?.score ?? null,
          bestPractices: lhr.categories?.["best-practices"]?.score ?? null,
        },
        audits: {
          contentWiderThanScreen: lhr.audits?.["content-width"]?.score ?? null,
          tapTargets: lhr.audits?.["tap-targets"]?.score ?? null,
          totalBlockingTime: lhr.audits?.["total-blocking-time"]?.numericValue ?? null,
        },
      }
    } catch (e) {
      out[r] = { error: String(e && e.message ? e.message : e) }
    }
  }
  fs.writeFileSync(
    path.join(OUT_DIR, "lighthouse.json"),
    JSON.stringify(out, null, 2)
  )
  console.log("Wrote:", path.join(OUT_DIR, "lighthouse.json"))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})



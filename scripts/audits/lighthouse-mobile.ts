import fs from "fs"
import path from "path"
import lighthouse from "lighthouse"
import chromeLauncher from "chrome-launcher"

const BASE =
  process.env.MOBILE_AUDIT_BASE_URL || "http://localhost:3000"
const OUT_DIR = path.join(process.cwd(), "audits", "mobile")
const ROUTES = [
  "/",
  "/strategies",
  "/strategies/Alpha-stETH",
  "/strategies/Alpha-stETH/manage",
]

async function run(url: string) {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ["--headless=new", "--no-sandbox"],
  })
  const opts: any = {
    logLevel: "error",
    output: "json",
    onlyCategories: [
      "performance",
      "accessibility",
      "best-practices",
    ],
    port: chrome.port,
    formFactor: "mobile",
    screenEmulation: {
      mobile: true,
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      disabled: false,
    },
    throttling: {
      rttMs: 150,
      throughputKbps: 1638,
      cpuSlowdownMultiplier: 4,
      requestLatencyMs: 150,
      downloadThroughputKbps: 1638,
      uploadThroughputKbps: 750,
    },
  }
  const runnerResult: any = await lighthouse(url, opts)
  await chrome.kill()
  return runnerResult.lhr
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const out: Record<string, any> = {}
  for (const r of ROUTES) {
    const url = BASE + r
    const lhr = await run(url)
    out[r] = {
      requestedUrl: lhr.requestedUrl,
      finalUrl: lhr.finalUrl,
      categories: {
        performance: lhr.categories.performance?.score,
        accessibility: lhr.categories.accessibility?.score,
        bestPractices: lhr.categories["best-practices"]?.score,
      },
      audits: {
        contentWiderThanScreen: lhr.audits["content-width"]?.score,
        tapTargets: lhr.audits["tap-targets"]?.score,
        totalBlockingTime:
          lhr.audits["total-blocking-time"]?.numericValue,
      },
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

import fs from "fs"
import os from "os"
import path from "path"

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")

// Short copy variants; you can tweak freely here:
const activeMsg =
  "You’re earning with Somm. Alpha stETH is live—next-gen stETH strategy focused on capital efficiency. Migrate: https://app.somm.finance/strategies/alpha-steth/manage?src=debank_active"
const prevMsg =
  "Alpha stETH is live—a focused stETH strategy on Somm. If you liked Somm, try the upgrade: https://app.somm.finance/strategies/alpha-steth/manage?src=debank_prev"

function loadOneCol(file: string): string[] {
  const raw = fs.readFileSync(file, "utf8").trim().split(/\r?\n/)
  return raw.filter((_, i) => i > 0) // skip header
}

function writeCsv(file: string, rows: string[][]) {
  const body = rows
    .map((r) =>
      r.map((x) => `"${(x ?? "").replace(/"/g, '""')}"`).join(",")
    )
    .join("\n")
  fs.writeFileSync(file, `wallet,message\n${body}\n`)
}

;(async () => {
  const active = loadOneCol(path.join(OUT_DIR, "active_debank.csv"))
  const prev = loadOneCol(path.join(OUT_DIR, "previous_debank.csv"))

  writeCsv(
    path.join(OUT_DIR, "active_messages.csv"),
    active.map((w) => [w, activeMsg])
  )
  writeCsv(
    path.join(OUT_DIR, "previous_messages.csv"),
    prev.map((w) => [w, prevMsg])
  )

  console.log("Wrote:", path.join(OUT_DIR, "active_messages.csv"))
  console.log("Wrote:", path.join(OUT_DIR, "previous_messages.csv"))
})()

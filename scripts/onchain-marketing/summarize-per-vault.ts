import fs from "fs"
import os from "os"
import path from "path"
import { VAULTS } from "./vaults"

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")

function safeRead(file: string): string | undefined {
  try {
    return fs.readFileSync(file, "utf8")
  } catch {
    return undefined
  }
}

function loadActiveIndex(): Map<string, Set<string>> {
  const m = new Map<string, Set<string>>()
  const file = path.join(OUT_DIR, "nonalpha_active.csv")
  const raw = safeRead(file)
  if (!raw) return m
  const lines = raw.trim().split(/\r?\n/)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    const idx = line.indexOf(",")
    if (idx === -1) continue
    const wallet = line.slice(0, idx).toLowerCase()
    const vaultsCol = line.slice(idx + 1)
    const names = vaultsCol
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean)
    for (const n of names) {
      if (!m.has(n)) m.set(n, new Set<string>())
      m.get(n)!.add(wallet)
    }
  }
  return m
}

function loadVaultHolders(name: string): Set<string> | undefined {
  const file = path.join(
    OUT_DIR,
    `holders_${name.replace(/[^a-z0-9-_]/gi, "_")}.csv`
  )
  const raw = safeRead(file)
  if (!raw) return undefined
  const lines = raw.trim().split(/\r?\n/)
  const set = new Set<string>()
  for (let i = 1; i < lines.length; i++) {
    const w = lines[i].trim().toLowerCase()
    if (w) set.add(w)
  }
  return set
}

function toPct(n: number, d: number): string {
  if (!d) return "0.0%"
  return `${((n / d) * 100).toFixed(1)}%`
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const activeIdx = loadActiveIndex()

  const rows = [
    "vault,chain,address,total_holders,active_holders,previous_holders,active_pct",
  ]

  for (const v of VAULTS) {
    const holders = loadVaultHolders(v.name)
    if (!holders) continue
    const total = holders.size
    const activeSet = activeIdx.get(v.name) || new Set<string>()
    let active = 0
    for (const w of holders) if (activeSet.has(w)) active++
    const previous = total - active
    rows.push(
      [
        v.name,
        v.chain,
        v.address,
        String(total),
        String(active),
        String(previous),
        toPct(active, total),
      ].join(",")
    )
  }

  const out = path.join(OUT_DIR, "per_vault_summary.csv")
  fs.writeFileSync(out, rows.join("\n"))
  console.log("Wrote:", out)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

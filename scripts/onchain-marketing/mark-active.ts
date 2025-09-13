import fs from "fs"
import os from "os"
import path from "path"
import { Contract, JsonRpcProvider } from "ethers"
import pLimit from "p-limit"
import { VAULTS, RPC, Chain } from "./vaults"

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")
const IN_FILE = path.join(OUT_DIR, "holders_merged.csv")
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
]

const providers: Partial<Record<Chain, JsonRpcProvider>> = {}
for (const [chain, url] of Object.entries(RPC)) {
  if (url) providers[chain as Chain] = new JsonRpcProvider(url)
}

function loadWallets(): string[] {
  const raw = fs.readFileSync(IN_FILE, "utf8").trim().split(/\r?\n/)
  const headerRemoved = raw
    .filter((_, i) => i > 0)
    .map((s) => s.toLowerCase())
  return Array.from(new Set(headerRemoved))
}

async function hasAnyBalance(
  wallet: string
): Promise<{ active: boolean; activeVaults: string[] }> {
  const activeVaults: string[] = []
  const limit = pLimit(12)
  await Promise.all(
    VAULTS.map((v) =>
      limit(async () => {
        const p = providers[v.chain as Chain]
        if (!p) return
        const c = new Contract(v.address, erc20Abi, p)
        try {
          const bal: bigint = await c.balanceOf(wallet)
          if (bal > 0n) activeVaults.push(v.name)
        } catch {}
      })
    )
  )
  return { active: activeVaults.length > 0, activeVaults }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const wallets = loadWallets()
  console.log(
    `Marking ${wallets.length} wallets as Active/Previous...`
  )
  const limit = pLimit(20)

  const rowsActive = ["wallet,vaults_active"]
  const rowsPrev = ["wallet"]
  const rowsAll = ["wallet"]
  const rowsDebankActive = ["wallet"]
  const rowsDebankPrev = ["wallet"]

  let processed = 0
  await Promise.all(
    wallets.map((w) =>
      limit(async () => {
        const res = await hasAnyBalance(w)
        rowsAll.push(w)
        if (res.active) {
          rowsActive.push(`${w},${res.activeVaults.join("|")}`)
          rowsDebankActive.push(w)
        } else {
          rowsPrev.push(w)
          rowsDebankPrev.push(w)
        }
        processed++
        if (processed % 500 === 0)
          console.log(`  processed ${processed}/${wallets.length}`)
      })
    )
  )

  fs.writeFileSync(
    path.join(OUT_DIR, "nonalpha_active.csv"),
    rowsActive.join("\n")
  )
  fs.writeFileSync(
    path.join(OUT_DIR, "nonalpha_previous.csv"),
    rowsPrev.join("\n")
  )
  fs.writeFileSync(
    path.join(OUT_DIR, "nonalpha_all.csv"),
    rowsAll.join("\n")
  )
  fs.writeFileSync(
    path.join(OUT_DIR, "active_debank.csv"),
    rowsDebankActive.join("\n")
  )
  fs.writeFileSync(
    path.join(OUT_DIR, "previous_debank.csv"),
    rowsDebankPrev.join("\n")
  )

  console.log("Done. Files in", OUT_DIR)
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})

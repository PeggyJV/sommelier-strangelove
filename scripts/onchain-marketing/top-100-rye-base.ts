import fs from "fs"
import os from "os"
import path from "path"
import pLimit from "p-limit"
import { Contract, JsonRpcProvider } from "ethers"
import { VAULTS, RPC } from "./vaults"

/*
  Rank top 100 Real-Yield-ETH holders by base asset value (assets = convertToAssets(shares)).
  Inputs:
    - OUT_DIR (optional) default: ~/Desktop/on-chain-marketing/outputs
    - RPC_MAINNET (required)
    - WALLETS_FILE (optional) default: holders_Real-Yield-ETH.csv or holders_merged.csv
  Output:
    - top_100_rye_base.csv (wallet only)
*/

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")

const MAINNET_URL = process.env.RPC_MAINNET || RPC.mainnet
if (!MAINNET_URL) {
  console.error("Missing RPC_MAINNET")
  process.exit(1)
}

const provider = new JsonRpcProvider(MAINNET_URL, { chainId: 1, name: "mainnet" }, { staticNetwork: true })

const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
]
const erc4626Abi = [
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function previewRedeem(uint256 shares) view returns (uint256)",
]

function pickWalletsFile(): string {
  const perVault = path.join(OUT_DIR, "holders_Real-Yield-ETH.csv")
  if (fs.existsSync(perVault)) return perVault
  const merged = path.join(OUT_DIR, "holders_merged.csv")
  if (fs.existsSync(merged)) return merged
  throw new Error("holders_Real-Yield-ETH.csv or holders_merged.csv not found in OUT_DIR")
}

function loadWallets(file: string): string[] {
  const raw = fs.readFileSync(file, "utf8").trim().split(/\r?\n/)
  const header = raw[0]?.toLowerCase() || ""
  const hasHeader = header.includes("wallet")
  const lines = hasHeader ? raw.slice(1) : raw
  return Array.from(new Set(lines.map((s) => s.trim().toLowerCase()).filter(Boolean)))
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const rye = VAULTS.find((v) => v.name === "Real-Yield-ETH")
  if (!rye) throw new Error("Real-Yield-ETH vault not found in registry")
  const vaultAddr = rye.address.toLowerCase()

  const walletsFile = process.env.WALLETS_FILE || pickWalletsFile()
  const wallets = loadWallets(walletsFile)
  if (!wallets.length) throw new Error("No wallets to process")

  const token = new Contract(vaultAddr, erc20Abi, provider)
  const vault = new Contract(vaultAddr, erc4626Abi, provider)

  const limit = pLimit(20)
  const totals = new Map<string, bigint>()

  await Promise.all(
    wallets.map((w) =>
      limit(async () => {
        try {
          const bal: bigint = await token.balanceOf(w)
          if (bal === 0n) return
          let assets: bigint = 0n
          try {
            assets = await vault.convertToAssets(bal)
          } catch {
            try {
              assets = await vault.previewRedeem(bal)
            } catch {
              assets = 0n
            }
          }
          if (assets > 0n) totals.set(w, assets)
        } catch {}
      })
    )
  )

  const top = Array.from(totals.entries())
    .sort((a, b) => (a[1] === b[1] ? 0 : a[1] > b[1] ? -1 : 1))
    .slice(0, 100)
    .map(([w]) => w)

  const outPath = path.join(OUT_DIR, "top_100_rye_base.csv")
  fs.writeFileSync(outPath, ["wallet", ...top].join("\n"))
  console.log("Wrote:", outPath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})



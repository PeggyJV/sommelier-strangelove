import fs from "fs"
import os from "os"
import path from "path"
import { Contract, JsonRpcProvider } from "ethers"
import pLimit from "p-limit"
import { VAULTS, RPC, ALPHA_STETH, type Chain } from "./vaults"

/*
  Compute top 100 wallets by total Sommelier vault share value in USD (≈ USDC).
  Reuses the onchain marketing registry (VAULTS) and RPCs.

  Inputs:
    - OUT_DIR (optional): where to read/write CSVs
    - WALLETS_FILE (optional): path to CSV of wallets (defaults to holders_merged.csv)
    - INCLUDE_ALPHA=(true|false): include Alpha stETH share token (mainnet)

  Output:
    - top_100_wallets.csv (wallet only, header: wallet)
*/

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")
const WALLETS_FILE =
  process.env.WALLETS_FILE || path.join(OUT_DIR, "holders_merged.csv")
const INCLUDE_ALPHA =
  String(process.env.INCLUDE_ALPHA || "false").toLowerCase() ===
  "true"
const ONLY_CHAIN = (process.env.ONLY_CHAIN || "").toLowerCase() as
  | ""
  | Chain

// Minimal ABIs
const erc20Abi = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)",
]
const erc4626Abi = [
  "function asset() view returns (address)",
  "function convertToAssets(uint256 shares) view returns (uint256)",
  "function previewRedeem(uint256 shares) view returns (uint256)",
]
const priceRouterAbi = [
  "function getPriceInUSD(address token) view returns (uint256)",
]

// Price router addresses (keep in sync with src/data/chainConfig)
const PRICE_ROUTER: Record<Chain, string> = {
  mainnet: "0xA1A0bc3D59e4ee5840c9530e49Bdc2d1f88AaF92",
  arbitrum: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
  optimism: "0xBB35643AE2Af63C616a7ed6eB8Df15ca1d86fe11",
  scroll: "",
}

type TokenDef = { name: string; address: string; chain: Chain }

function loadWallets(file: string): string[] {
  const raw = fs.readFileSync(file, "utf8").trim().split(/\r?\n/)
  // Allow either single-column CSV with header or raw list
  const header = raw[0]?.toLowerCase() || ""
  const hasHeader =
    header.includes("wallet") || header.includes("address")
  const lines = hasHeader ? raw.slice(1) : raw
  return Array.from(
    new Set(lines.map((s) => s.trim().toLowerCase()).filter(Boolean))
  )
}

function buildProviders(): Partial<Record<Chain, JsonRpcProvider>> {
  const map: Partial<Record<Chain, JsonRpcProvider>> = {}
  const net: Record<Chain, { chainId: number; name: string }> = {
    mainnet: { chainId: 1, name: "mainnet" },
    arbitrum: { chainId: 42161, name: "arbitrum" },
    optimism: { chainId: 10, name: "optimism" },
    scroll: { chainId: 534352, name: "scroll" },
  }
  for (const [chain, url] of Object.entries(RPC)) {
    const c = chain as Chain
    if (url)
      map[c] = new JsonRpcProvider(url, net[c], {
        staticNetwork: true,
      })
  }
  return map
}

function buildTokens(): TokenDef[] {
  let base: TokenDef[] = VAULTS.map((v) => ({
    name: v.name,
    address: v.address.toLowerCase(),
    chain: v.chain,
  }))
  if (ONLY_CHAIN) base = base.filter((t) => t.chain === ONLY_CHAIN)
  if (INCLUDE_ALPHA) {
    const alphaAddr = ALPHA_STETH[0]
    if (alphaAddr)
      base.push({
        name: "Alpha-stETH",
        address: alphaAddr.toLowerCase(),
        chain: "mainnet",
      })
  }
  return base
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const wallets = loadWallets(WALLETS_FILE)
  if (!wallets.length) throw new Error("No wallets found")

  const providers = buildProviders()

  // Price routers per chain
  const routers: Partial<Record<Chain, Contract>> = {}
  for (const [chain, addr] of Object.entries(PRICE_ROUTER)) {
    const c = chain as Chain
    const p = providers[c]
    if (p && addr) routers[c] = new Contract(addr, priceRouterAbi, p)
  }

  const tokens = buildTokens()

  // Preload share USD using ERC-4626 + price router
  const decMap = new Map<string, number>() // share decimals
  const usdMap = new Map<string, number>() // share USD price

  const preloadLimit = pLimit(8)
  await Promise.all(
    tokens.map((t) =>
      preloadLimit(async () => {
        try {
          const p = providers[t.chain]
          const pr = routers[t.chain]
          if (!p || !pr) return
          const shareErc = new Contract(t.address, erc20Abi, p)
          const shareDec = await shareErc.decimals().catch(() => 18)
          const vault = new Contract(t.address, erc4626Abi, p)
          const underlying: string = await vault.asset().catch(() => "")
          if (!underlying) return
          const priceBn: bigint = await pr
            .getPriceInUSD(underlying)
            .catch(() => 0n)
          const undUsd = Number(priceBn) / 1e8
          if (!(undUsd > 0)) return
          const undErc = new Contract(underlying, erc20Abi, p)
          const undDec = await undErc.decimals().catch(() => 18)
          const oneShare = 10n ** BigInt(shareDec)
          let assets: bigint = 0n
          try {
            assets = await vault.convertToAssets(oneShare)
          } catch {
            try {
              assets = await vault.previewRedeem(oneShare)
            } catch {
              assets = 0n
            }
          }
          if (assets <= 0n) return
          const assetsFloat = Number(assets) / 10 ** undDec
          const shareUsd = assetsFloat * undUsd
          if (shareUsd > 0) {
            decMap.set(t.address, Number(shareDec))
            usdMap.set(t.address, shareUsd)
          }
        } catch {}
      })
    )
  )

  // Filter tokens we could price
  const priced = tokens.filter(
    (t) => usdMap.has(t.address) && decMap.has(t.address)
  )
  if (!priced.length)
    throw new Error("No tokens could be priced; check RPC and router")

  console.log(
    `Wallets: ${wallets.length}, Tokens priced: ${priced.length}`
  )

  const totalUsd = new Map<string, number>()
  const balLimit = pLimit(16)

  // For each token, get balances for all wallets and accumulate USD
  for (const t of priced) {
    const p = providers[t.chain]
    if (!p) continue
    const erc = new Contract(t.address, erc20Abi, p)
    const dec = decMap.get(t.address) as number
    const price = usdMap.get(t.address) as number

    await Promise.all(
      wallets.map((w) =>
        balLimit(async () => {
          try {
            const bal: bigint = await erc.balanceOf(w)
            if (bal > 0n) {
              const v = Number(bal) / 10 ** dec
              const usd = v * price
              if (usd > 0)
                totalUsd.set(w, (totalUsd.get(w) || 0) + usd)
            }
          } catch {}
        })
      )
    )
  }

  // Sort and take top 100 by USD
  const top = Array.from(totalUsd.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([w]) => w)

  const outPath = path.join(OUT_DIR, "top_100_wallets.csv")
  fs.writeFileSync(outPath, ["wallet", ...top].join("\n"))
  console.log("Wrote:", outPath)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

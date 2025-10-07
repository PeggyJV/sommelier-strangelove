/*
  Export current depositors per active vault as CSV + JSON.

  Reuses existing onchain-marketing registry and utilities:
  - scripts/onchain-marketing/vaults.ts (VAULTS, RPC)
  - scripts/onchain-marketing/utils.ts (resolveStartBlock, detectChunk, latestBlock)

  Output: exports/vaults/<chain>-<slug>.csv + .json

  Env requirements (fail-fast):
  - RPC_MAINNET / RPC_ARBITRUM / RPC_OPTIMISM / RPC_SCROLL (as needed)

  Run:
    pnpm export:vaults
*/

import fs from "fs"
import path from "path"
import { createPublicClient, http, erc20Abi, type Hex } from "viem"
import { mainnet, arbitrum, optimism, scroll } from "viem/chains"
import { VAULTS, RPC, type Chain } from "../onchain-marketing/vaults"
import {
  resolveStartBlock,
  detectChunk,
  latestBlock,
} from "../onchain-marketing/utils"

type VaultDef = (typeof VAULTS)[number]

const OUT_DIR = path.join(process.cwd(), "exports", "vaults")
const TOPIC_TRANSFER: Hex =
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"

type Row = {
  wallet: string
  amount: string
  deposit_asset: string
  amountRaw?: string
  assetAddress?: string
  vault?: string
  chainId?: number
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function toHuman(raw: bigint, decimals: number, dp = 6): string {
  const base = 10n ** BigInt(decimals)
  const whole = raw / base
  const frac = raw % base
  if (frac === 0n) return whole.toString()
  const fracStr = frac.toString().padStart(decimals, "0").slice(0, dp)
  return `${whole.toString()}.${fracStr}`
}

function toCSV(rows: Row[]): string {
  const header = "wallet,amount,deposit_asset"
  const lines = rows.map(
    (r) => `${r.wallet},${r.amount},${r.deposit_asset}`
  )
  return [header, ...lines].join("\n")
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-_]/g, "-")
}

function chainIdOf(chain: Chain): number {
  if (chain === "mainnet") return 1
  if (chain === "arbitrum") return 42161
  if (chain === "optimism") return 10
  if (chain === "scroll") return 534352
  return 0
}

function requireRpc(chain: Chain): string {
  const direct = RPC[chain]
  if (direct) return direct

  const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY || ""
  const infuraKey = process.env.NEXT_PUBLIC_INFURA_API_KEY || ""

  // Prefer Alchemy if available
  if (alchemyKey) {
    if (chain === "mainnet")
      return `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`
    if (chain === "arbitrum")
      return `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`
    if (chain === "optimism")
      return `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`
  }
  // Fallback to Infura if available
  if (infuraKey) {
    if (chain === "mainnet")
      return `https://mainnet.infura.io/v3/${infuraKey}`
    if (chain === "arbitrum")
      return `https://arbitrum-mainnet.infura.io/v3/${infuraKey}`
    if (chain === "optimism")
      return `https://optimism-mainnet.infura.io/v3/${infuraKey}`
  }
  if (chain === "scroll") {
    // Scroll requires explicit RPC_SCROLL in this repo
    console.error(
      "Missing RPC for scroll. Set RPC_SCROLL to a valid HTTPS endpoint (e.g., https://rpc.scroll.io)."
    )
  } else {
    console.error(
      `Missing RPC for ${chain}. Set RPC_${chain.toUpperCase()} or provide NEXT_PUBLIC_ALCHEMY_KEY / NEXT_PUBLIC_INFURA_API_KEY.`
    )
  }
  process.exit(1)
}

async function fetchHoldersViaLogs(
  client: ReturnType<typeof createPublicClient>,
  rpcUrl: string,
  token: Hex,
  fromBlock: number,
  toBlock: number
): Promise<Set<string>> {
  const holders = new Set<string>()
  const step = detectChunk(rpcUrl)
  let start = fromBlock
  while (start <= toBlock) {
    const end = Math.min(start + step, toBlock)
    let logs: any[] = []
    try {
      logs = await client.getLogs({
        address: token,
        fromBlock: BigInt(start),
        toBlock: BigInt(end),
        topics: [TOPIC_TRANSFER],
      })
    } catch (e) {
      // fallback smaller window
      const mid = Math.floor((start + end) / 2)
      if (mid === start) break
      const first = await fetchHoldersViaLogs(
        client,
        rpcUrl,
        token,
        start,
        mid
      )
      const second = await fetchHoldersViaLogs(
        client,
        rpcUrl,
        token,
        mid + 1,
        end
      )
      for (const w of first) holders.add(w)
      for (const w of second) holders.add(w)
      start = end + 1
      continue
    }
    for (const lg of logs) {
      // topics[1]=from, topics[2]=to (indexed)
      const from = lg.topics?.[1]
      const to = lg.topics?.[2]
      if (from && from.length === 66)
        holders.add(`0x${from.slice(26)}`.toLowerCase())
      if (to && to.length === 66)
        holders.add(`0x${to.slice(26)}`.toLowerCase())
    }
    start = end + 1
  }
  // remove zero address
  holders.delete("0x0000000000000000000000000000000000000000")
  return holders
}

async function exportVault(v: VaultDef) {
  const chain = v.chain
  const rpc = requireRpc(chain)
  const viemChain =
    chain === "mainnet"
      ? mainnet
      : chain === "arbitrum"
      ? arbitrum
      : chain === "optimism"
      ? optimism
      : scroll
  const client = createPublicClient({
    chain: viemChain,
    transport: http(rpc),
  })
  const token = v.address as Hex

  const [symbol, decimals] = await Promise.all([
    client
      .readContract({
        address: token,
        abi: erc20Abi,
        functionName: "symbol",
      })
      .catch(() => "TOKEN"),
    client
      .readContract({
        address: token,
        abi: erc20Abi,
        functionName: "decimals",
      })
      .catch(() => 18),
  ])

  const startFromEnv =
    typeof v.startBlock === "number" ? v.startBlock : undefined
  const startBlock =
    startFromEnv ?? (await resolveStartBlock(token, chain))
  const latest = Number(await client.getBlockNumber())

  const holders = await fetchHoldersViaLogs(
    client,
    rpc,
    token,
    startBlock,
    latest
  )
  const rows: Row[] = []

  // Query balances batch-style (simple loop)
  for (const wallet of holders) {
    try {
      const bal = (await client.readContract({
        address: token,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [wallet as Hex],
      })) as bigint
      if (bal <= 0n) continue
      rows.push({
        wallet,
        amount: toHuman(bal, Number(decimals), 6),
        deposit_asset: symbol,
        amountRaw: bal.toString(),
        assetAddress: token,
        vault: v.name,
        chainId: chainIdOf(chain),
      })
    } catch {}
  }

  // Sort by amount desc
  rows.sort((a, b) =>
    BigInt(b.amountRaw || "0") > BigInt(a.amountRaw || "0") ? 1 : -1
  )

  ensureDir(OUT_DIR)
  const base = `${chain}-${slugify(v.name)}`
  fs.writeFileSync(path.join(OUT_DIR, `${base}.csv`), toCSV(rows))
  fs.writeFileSync(
    path.join(OUT_DIR, `${base}.json`),
    JSON.stringify(rows, null, 2)
  )
  console.log(
    `Exported ${rows.length} wallets for ${v.name} (${chain})`
  )
}

async function run() {
  try {
    const active = VAULTS
    if (!active?.length) {
      console.error("No active vaults in registry.")
      process.exit(2)
    }
    let ok = 0
    for (const v of active) {
      try {
        await exportVault(v)
        ok++
      } catch (e: any) {
        console.error(`Failed to export ${v.name}:`, e?.message || e)
      }
    }
    console.log(`Done. Exported ${ok}/${active.length} vaults`)
  } catch (err) {
    console.error("Fatal:", err)
    process.exit(1)
  }
}

run()

import fs from "fs"
import path from "path"
import { JsonRpcProvider } from "ethers"

const CACHE_DIR = path.join(process.cwd(), ".cache")
const STARTS_FILE = path.join(CACHE_DIR, "startBlocks.json")
const PROGRESS_FILE = path.join(CACHE_DIR, "progress.json")

export function ensureCacheDir() {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
}

export function loadJson(file: string): any {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"))
  } catch {
    return {}
  }
}
export function saveJson(file: string, obj: any) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2))
}

export function loadStartBlocks(): Record<string, number> {
  return loadJson(STARTS_FILE)
}
export function saveStartBlocks(v: Record<string, number>) {
  saveJson(STARTS_FILE, v)
}

export function loadProgress(): Record<string, number> {
  return loadJson(PROGRESS_FILE)
}
export function saveProgress(v: Record<string, number>) {
  saveJson(PROGRESS_FILE, v)
}

export function keyOf(vaultAddr: string, topic0: string) {
  return `${vaultAddr.toLowerCase()}::${topic0.toLowerCase()}`
}

export function detectChunk(rpcUrl: string): number {
  const u = (rpcUrl || "").toLowerCase()
  // Alchemy and quicknode are fine with larger ranges; Infura safer smaller
  if (u.includes("alchemy.com")) return 50000
  if (u.includes("quiknode") || u.includes("quicknode")) return 40000
  return 12000
}

// Best-effort: ask Etherscan for contract creation block
export async function fetchStartBlockEtherscan(
  addr: string,
  chain: "mainnet" | "arbitrum" | "optimism" | "scroll"
): Promise<number | undefined> {
  const key = process.env.ETHERSCAN_API_KEY || ""
  let base = ""
  if (chain === "mainnet") base = "https://api.etherscan.io"
  else if (chain === "arbitrum") base = "https://api.arbiscan.io"
  else if (chain === "optimism")
    base = "https://api-optimistic.etherscan.io"
  else return undefined // no scroll explorer API here

  if (!key) return undefined
  const url = `${base}/api?module=contract&action=getcontractcreation&contractaddresses=${addr}&apikey=${key}`
  try {
    const res = await fetch(url)
    const j = await res.json()
    if (
      j?.status === "1" &&
      Array.isArray(j.result) &&
      j.result[0]?.blockNumber
    ) {
      return Number(j.result[0].blockNumber)
    }
  } catch {}
  return undefined
}

export async function resolveStartBlock(
  addr: string,
  chain: "mainnet" | "arbitrum" | "optimism" | "scroll"
): Promise<number> {
  ensureCacheDir()
  const starts = loadStartBlocks()
  const k = `${chain}:${addr.toLowerCase()}`
  if (starts[k]) return starts[k]

  // try etherscan
  const fromE = await fetchStartBlockEtherscan(addr, chain)
  if (fromE && Number.isFinite(fromE)) {
    starts[k] = fromE
    saveStartBlocks(starts)
    return fromE
  }

  // fallback: 0 (will be slower); caller may override via vault.startBlock
  starts[k] = 0
  saveStartBlocks(starts)
  return 0
}

export async function latestBlock(
  provider: JsonRpcProvider
): Promise<number> {
  return provider.getBlockNumber()
}

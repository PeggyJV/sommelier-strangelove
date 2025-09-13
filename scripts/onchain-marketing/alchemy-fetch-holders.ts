import fs from "fs"
import os from "os"
import path from "path"
import fetch from "node-fetch"
import { VAULTS, ALPHA_STETH } from "./vaults"

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")
const ALCHEMY_KEY_MAINNET =
  process.env.ALCHEMY_KEY_MAINNET ||
  process.env.NEXT_PUBLIC_ALCHEMY_KEY ||
  ""
const ALCHEMY_KEY_ARB =
  process.env.ALCHEMY_KEY_ARB ||
  process.env.NEXT_PUBLIC_ALCHEMY_KEY ||
  ""
const ALCHEMY_KEY_OPT =
  process.env.ALCHEMY_KEY_OPT ||
  process.env.NEXT_PUBLIC_ALCHEMY_KEY ||
  ""

type ChainCfg = {
  name: "mainnet" | "arbitrum" | "optimism"
  base: string
  key: string
}
const CHAINS: Record<string, ChainCfg> = {
  mainnet: {
    name: "mainnet",
    base: "https://eth-mainnet.g.alchemy.com/v2",
    key: ALCHEMY_KEY_MAINNET,
  },
  arbitrum: {
    name: "arbitrum",
    base: "https://arb-mainnet.g.alchemy.com/v2",
    key: ALCHEMY_KEY_ARB,
  },
  optimism: {
    name: "optimism",
    base: "https://opt-mainnet.g.alchemy.com/v2",
    key: ALCHEMY_KEY_OPT,
  },
}

async function fetchHolders(
  chain: "mainnet" | "arbitrum" | "optimism",
  token: string,
  maxPages = 50
) {
  const cfg = CHAINS[chain]
  if (!cfg || !cfg.key)
    throw new Error(`Missing Alchemy key for ${chain}`)
  const url = `${cfg.base}/${cfg.key}`
  const method = "alchemy_getAssetTransfers"
  const headers = { "content-type": "application/json" }

  // We want ERC-20 transfers of this token; we’ll union the from/to addresses
  let pageKey: string | undefined
  const holders = new Set<string>()
  for (let i = 0; i < maxPages; i++) {
    const body = {
      id: 1,
      jsonrpc: "2.0",
      method,
      params: [
        {
          category: ["erc20"],
          contractAddresses: [token],
          withMetadata: false,
          maxCount: "0x3E8", // 1000
          pageKey,
          order: "desc",
        },
      ],
    }
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    if (!res.ok)
      throw new Error(`Alchemy ${chain} error ${res.status}`)
    const j: any = await res.json()
    const txs = j?.result?.transfers || []
    for (const t of txs) {
      if (t.from) holders.add(String(t.from).toLowerCase())
      if (t.to) holders.add(String(t.to).toLowerCase())
    }
    pageKey = j?.result?.pageKey
    if (!pageKey) break
  }
  // Remove zero address if present
  holders.delete("0x0000000000000000000000000000000000000000")
  return Array.from(holders)
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  const byVault: Record<string, string[]> = {}
  for (const v of VAULTS) {
    const addrLc = v.address.toLowerCase()
    const skipByAddr = ALPHA_STETH.includes(addrLc)
    const skipByName = /turbo-steth|steth-deposit/i.test(v.name)
    if (skipByAddr || skipByName) {
      console.log(`[skip alpha] ${v.name} (${v.chain}) ${v.address}`)
      continue
    }
    if (!(v.chain in CHAINS)) {
      console.log(`[skip] ${v.name} (${v.chain}) – no Alchemy chain`)
      continue
    }
    console.log(
      `Fetching holders via Alchemy for ${v.name} (${v.chain}) ${v.address} ...`
    )
    const list = await fetchHolders(
      v.chain as any,
      v.address.toLowerCase(),
      Number(process.env.MAX_PAGES || 50)
    )
    byVault[v.name] = list
    // per-vault CSV
    const perVaultPath = path.join(
      OUT_DIR,
      `holders_${v.name.replace(/[^a-z0-9-_]/gi, "_")}.csv`
    )
    fs.writeFileSync(perVaultPath, ["wallet", ...list].join("\n"))
    console.log(`  -> ${list.length} holders -> ${perVaultPath}`)
  }
  // merged unique list
  const merged = new Set<string>()
  Object.values(byVault).forEach((list) =>
    list.forEach((w) => merged.add(w))
  )
  const mergedPath = path.join(OUT_DIR, "holders_merged.csv")
  fs.writeFileSync(
    mergedPath,
    ["wallet", ...Array.from(merged)].join("\n")
  )
  console.log(
    `Merged unique wallets: ${merged.size} -> ${mergedPath}`
  )
}
main().catch((e) => {
  console.error(e)
  process.exit(1)
})

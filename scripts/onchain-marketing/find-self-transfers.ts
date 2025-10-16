import fs from "fs"
import os from "os"
import path from "path"
import fetch from "node-fetch"
import * as dotenv from "dotenv"

// Load local env files similar to vaults.ts
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") })
dotenv.config({ path: path.resolve(process.cwd(), ".env.vercel") })

const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(os.homedir(), "Desktop", "on-chain-marketing", "outputs")

const ALCHEMY_KEY_MAINNET =
  process.env.ALCHEMY_KEY_MAINNET ||
  process.env.NEXT_PUBLIC_ALCHEMY_KEY ||
  ""

function parseArg(name: string): string | undefined {
  const idx = process.argv.findIndex((a) => a === name || a.startsWith(name + "="))
  if (idx === -1) return undefined
  const cur = process.argv[idx]
  if (cur.includes("=")) return cur.split("=")[1]
  return process.argv[idx + 1]
}

type Transfer = {
  hash: string
  blockNum?: string
  category?: string
  asset?: string
  value?: string
  from?: string
  to?: string
  rawContract?: { address?: string }
  metadata?: { blockTimestamp?: string }
}

async function fetchSelfTransfers(
  wallet: string,
  maxPages = 100
): Promise<Transfer[]> {
  if (!ALCHEMY_KEY_MAINNET)
    throw new Error("Missing Alchemy mainnet key (ALCHEMY_KEY_MAINNET)")

  const url = `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_KEY_MAINNET}`
  const headers = { "content-type": "application/json" }
  const method = "alchemy_getAssetTransfers"

  const out: Transfer[] = []
  let pageKey: string | undefined
  for (let i = 0; i < maxPages; i++) {
    const body = {
      id: 1,
      jsonrpc: "2.0",
      method,
      params: [
        {
          category: [
            "external",
            "internal",
            "erc20",
            "erc721",
            "erc1155",
          ],
          withMetadata: true,
          maxCount: "0x3E8", // 1000
          order: "desc",
          pageKey,
          fromAddress: wallet,
          toAddress: wallet,
        },
      ],
    }
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`Alchemy error ${res.status}`)
    const j: any = await res.json()
    const txs: Transfer[] = j?.result?.transfers || []
    // Defensive filter if API ignores combined from+to
    for (const t of txs) {
      if (
        String(t.from || "").toLowerCase() === wallet &&
        String(t.to || "").toLowerCase() === wallet
      ) {
        out.push(t)
      }
    }
    pageKey = j?.result?.pageKey
    if (!pageKey) break
  }
  return out
}

function toDecimalBlock(blockNum?: string): string {
  if (!blockNum) return ""
  try {
    return String(parseInt(blockNum, 16))
  } catch {
    return String(blockNum)
  }
}

function toCsvRow(t: Transfer): string {
  const cols = [
    t.hash || "",
    toDecimalBlock(t.blockNum),
    t?.metadata?.blockTimestamp || "",
    t.category || "",
    t.asset || "",
    t?.rawContract?.address || "",
    t.value || "",
    t.from || "",
    t.to || "",
  ]
  // rudimentary escaping
  return cols
    .map((c) => {
      const s = String(c)
      if (s.includes(",")) return `"${s.replace(/"/g, '""')}"`
      return s
    })
    .join(",")
}

async function main() {
  const inputAddr =
    parseArg("--address") || parseArg("-a") || process.env.WALLET || ""
  const wallet = String(inputAddr || "").toLowerCase().trim()
  if (!wallet) {
    throw new Error(
      "Provide wallet via --address 0x... or WALLET env var"
    )
  }

  fs.mkdirSync(OUT_DIR, { recursive: true })
  console.log(`Fetching self-transfers on mainnet for ${wallet} ...`)
  const txs = await fetchSelfTransfers(wallet, Number(process.env.MAX_PAGES || 100))
  console.log(`Found ${txs.length} self-transfers`)

  const header = [
    "txHash",
    "blockNumber",
    "blockTimestamp",
    "category",
    "asset",
    "rawContractAddress",
    "value",
    "from",
    "to",
  ].join(",")

  const rows = [header, ...txs.map((t) => toCsvRow(t))]
  const outPath = path.join(
    OUT_DIR,
    `self_transfers_${wallet.replace(/[^a-z0-9]/gi, "_")}.csv`
  )
  fs.writeFileSync(outPath, rows.join("\n"))
  console.log(`CSV written -> ${outPath}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})



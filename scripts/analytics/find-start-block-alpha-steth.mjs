#!/usr/bin/env node
/**
 * Finds the earliest block where the Alpha stETH contract exists and emitted logs.
 * Uses pure JSON-RPC so it works in CI without external APIs.
 *
 * Env:
 *  ETH_RPC_URL  required  mainnet RPC endpoint
 *  CONTRACT     optional  defaults to Alpha stETH address
 *  HIGH_BLOCK   optional  override latest block height
 *  LOW_SCAN     optional  how far back to scan from latest (default 2_500_000)
 *
 * Output:
 *  Prints a single integer block number to stdout and writes cache file:
 *  scripts/analytics/.alpha-start-block.json
 */

import fs from "node:fs/promises"

const RPC = process.env.ETH_RPC_URL
if (!RPC) {
  console.error("ETH_RPC_URL is required")
  process.exit(1)
}
const ADDRESS = (
  process.env.CONTRACT || "0xef417fce1883c6653e7dc6af7c6f85ccde84aa09"
).toLowerCase()
const LOW_SCAN = Number(process.env.LOW_SCAN || 2_500_000)

async function rpc(method, params = []) {
  const res = await fetch(RPC, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  })
  if (!res.ok) throw new Error(`RPC HTTP ${res.status}`)
  const json = await res.json()
  if (json.error)
    throw new Error(
      `RPC ${method} error ${JSON.stringify(json.error)}`
    )
  return json.result
}

function toHex(n) {
  return "0x" + BigInt(n).toString(16)
}
function fromHex(h) {
  return Number(BigInt(h))
}

async function getLatestBlockNumber() {
  const hex = await rpc("eth_blockNumber")
  return fromHex(hex)
}

async function hasCodeAt(address, blockNumber) {
  const code = await rpc("eth_getCode", [address, toHex(blockNumber)])
  return code && code !== "0x"
}

async function firstLogAfter(address, startBlock, endBlock) {
  // narrow window to find first log emitted by the contract
  let lo = startBlock
  let hi = endBlock
  let first = null

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const logs = await rpc("eth_getLogs", [
      { fromBlock: toHex(startBlock), toBlock: toHex(mid), address },
    ])
    if (Array.isArray(logs) && logs.length > 0) {
      first = logs[0]
      // tighten upper bound
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }
  return first ? fromHex(first.blockNumber) : null
}

async function main() {
  const latest = Number(
    process.env.HIGH_BLOCK || (await getLatestBlockNumber())
  )
  const low = Math.max(0, latest - LOW_SCAN)

  console.log(`🔍 Scanning for Alpha stETH contract deployment...`)
  console.log(`   Contract: ${ADDRESS}`)
  console.log(
    `   Range: ${low} to ${latest} (${latest - low} blocks)`
  )
  console.log(`   RPC: ${RPC}`)

  // Binary search earliest block where bytecode exists
  let lo = low
  let hi = latest
  let ans = null

  console.log(`   Binary searching for contract deployment...`)
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2)
    const exists = await hasCodeAt(ADDRESS, mid)
    if (exists) {
      ans = mid
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }

  if (ans == null) {
    console.error(
      `❌ Could not find bytecode for ${ADDRESS} between ${low} and ${latest}`
    )
    process.exit(2)
  }

  console.log(`   ✅ Found contract deployment at block ${ans}`)

  // Optional refinement: find the first emitted log near ans
  const refineWindowEnd = Math.min(latest, ans + 100_000)
  const firstLogBlock = await firstLogAfter(
    ADDRESS,
    Math.max(0, ans - 10_000),
    refineWindowEnd
  )
  const startBlock =
    firstLogBlock != null ? Math.min(ans, firstLogBlock) : ans

  console.log(`   🔍 Refining with first log search...`)
  if (firstLogBlock != null) {
    console.log(`   ✅ Found first log at block ${firstLogBlock}`)
  } else {
    console.log(`   ⚠️  No logs found, using deployment block`)
  }

  const cachePath = "scripts/analytics/.alpha-start-block.json"
  await fs.writeFile(
    cachePath,
    JSON.stringify(
      {
        alpha_steth: startBlock,
        discoveredAt: new Date().toISOString(),
        latestObserved: latest,
        contract: ADDRESS,
        deploymentBlock: ans,
        firstLogBlock: firstLogBlock,
      },
      null,
      2
    )
  )

  console.log(`   📝 Cached result to ${cachePath}`)
  console.log(`   🎯 Alpha stETH start block: ${startBlock}`)
  console.log(startBlock)
}

main().catch((e) => {
  console.error("❌ Discovery failed:", e.message)
  process.exit(1)
})

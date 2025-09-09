import { Redis } from "@upstash/redis"
import fs from "node:fs/promises"
import os from "node:os"

const url =
  process.env.ATTRIB_KV_KV_REST_API_URL || process.env.KV_REST_API_URL
const token =
  process.env.ATTRIB_KV_KV_REST_API_TOKEN ||
  process.env.KV_REST_API_TOKEN
if (!url || !token) {
  console.error(
    "Missing KV REST envs: ATTRIB_KV_KV_REST_API_URL/TOKEN or KV_REST_API_URL/TOKEN"
  )
  process.exit(1)
}

const outCsv =
  process.argv[2] ||
  `${os.homedir()}/Desktop/kv-events-with-txhash.csv`
const outSummary =
  process.argv[3] ||
  `${os.homedir()}/Desktop/kv-events-with-txhash-summary.txt`

const redis = new Redis({ url, token })

async function* scanIterator(match, count = 1000) {
  let cursor = 0
  while (true) {
    const res = await redis.scan(cursor, { match, count })
    cursor = Number(res[0])
    const keys = res[1] || []
    for (const k of keys) yield k
    if (cursor === 0) break
  }
}

function toCsvValue(v) {
  const s = String(v ?? "")
  return '"' + s.replaceAll('"', '""') + '"'
}

async function main() {
  const batchSize = Number(process.env.BATCH_SIZE || 200)
  let found = 0
  const header =
    [
      "key",
      "txHash",
      "stage",
      "domain",
      "pagePath",
      "sessionId",
      "chainId",
      "method",
      "timestampMs",
    ].join(",") + "\n"
  await fs.writeFile(outCsv, header)

  let batch = []
  for await (const key of scanIterator("rpc:evt:*", 2000)) {
    batch.push(key)
    if (batch.length >= batchSize) {
      await flush(batch)
      batch = []
    }
  }
  if (batch.length) await flush(batch)

  await fs.writeFile(outSummary, `events_with_txhash=${found}\n`)
  console.error(`Wrote ${outCsv} and ${outSummary}`)

  async function flush(keys) {
    const vals = await redis.mget(...keys)
    const lines = []
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const raw = vals[i]
      if (!raw) continue
      let evt
      try {
        evt = typeof raw === "string" ? JSON.parse(raw) : raw
      } catch {
        continue
      }
      const tx = evt?.txHash
      if (!tx) continue
      found++
      lines.push(
        [
          toCsvValue(key),
          toCsvValue(tx),
          toCsvValue(evt?.stage),
          toCsvValue(evt?.domain),
          toCsvValue(evt?.pagePath),
          toCsvValue(evt?.sessionId),
          toCsvValue(evt?.chainId),
          toCsvValue(evt?.method),
          toCsvValue(evt?.timestampMs),
        ].join(",") + "\n"
      )
    }
    if (lines.length) await fs.appendFile(outCsv, lines.join(""))
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

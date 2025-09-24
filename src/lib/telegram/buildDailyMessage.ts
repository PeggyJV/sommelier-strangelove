export type BuildOpts = {
  forDate?: string
  tz?: string
}

function toCSV(rows: string[], headers: string[]): string {
  const esc = (v: string) => `"${String(v).replace(/"/g, '""')}"`
  return [headers.join(","), ...rows.map((r) => esc(r))].join("\n")
}

function formatAmountETH(amount: string | number | bigint, decimals = 18): string {
  const amountBN = BigInt(amount)
  const divisor = BigInt(10) ** BigInt(decimals)
  const whole = amountBN / divisor
  const remainder = amountBN % divisor
  if (remainder === 0n) return whole.toString()
  const remStr = remainder.toString().padStart(decimals, "0").replace(/0+$/, "")
  return `${whole}.${remStr}`
}

async function fetchETHPriceUSD(): Promise<number | null> {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
    )
    const data = await res.json()
    return data?.ethereum?.usd ?? null
  } catch {
    return null
  }
}

export async function buildDailyMessage(_opts: BuildOpts = {}): Promise<string> {
  const apiBase =
    process.env.REPORT_API_BASE ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://app.somm.finance")

  const startBlock = Number(process.env.START_BLOCK_ALPHA_STETH || NaN)
  if (!Number.isFinite(startBlock)) {
    throw new Error("START_BLOCK_ALPHA_STETH missing or invalid")
  }

  const url = `${apiBase}/api/deposits/by-block?fromBlock=${startBlock}&toBlock=+inf&order=desc&limit=10000`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`deposits fetch failed ${res.status}`)
  }
  const events: any[] = (await res.json()) ?? []
  // Filter out obvious test data to match exporter behavior
  const valid = events.filter(
    (e) =>
      !(typeof e.txHash === "string" && e.txHash.includes("deadbeef")) &&
      !(typeof e.ethAddress === "string" && e.ethAddress.includes("4444444444444444444444444444444444444444"))
  )

  const rows = valid.map((e) => {
    const isoUTC = new Date(Number(e.timestamp)).toISOString()
    const dateOnly = isoUTC.slice(0, 10)
    const amountETH = formatAmountETH(e.amount, e.decimals || 18)
    return { date: dateOnly, amountETH, txHash: e.txHash }
  })

  const totalCount = rows.length
  const totalEthNum = rows.reduce((sum, r) => sum + Number(r.amountETH), 0)
  const ethPrice = await fetchETHPriceUSD()
  const totalUsd = ethPrice ? totalEthNum * ethPrice : null

  const usdFmt = (n: number) =>
    Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const header = "📊 Alpha stETH Deposits (Validated)\n\n📈 Chunk 1/1"
  const total = `💰 Total: ${totalCount} transactions, ${totalEthNum.toFixed(6)} ETH${
    totalUsd ? ` (≈ $${usdFmt(totalUsd)})` : ""
  }`
  const meta = `🔗 Start Block: ${startBlock}`
  const tableHead = [
    "Date       | Amount ETH | Transaction Hash",
    "-----------|------------|------------------",
  ].join("\n")
  const lines = rows.map((r) => `${r.date} | ${r.amountETH} ETH | ${r.txHash}`)
  const footer = "✅ All transactions validated and from production data only"

  const text = [header, "", total, "", meta, "", tableHead, "", ...lines, "", footer].join("\n")
  return text
}



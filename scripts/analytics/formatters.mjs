// Formatter utilities for Alpha stETH deposit exports

export function toTallinnISO(ts) {
  // Convert ms epoch to Europe/Tallinn ISO date (no external libs)
  // Telegram preview uses date only, files keep full ISO
  const d = new Date(Number(ts))
  // Keep UTC ISO for files
  const isoUTC = d.toISOString()
  const dateOnly = isoUTC.slice(0, 10)
  return { isoUTC, dateOnly }
}

export function toCSV(rows, headers) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => esc(r[h] ?? "")).join(",")),
  ].join("\n")
}

export function chunk(array, size) {
  const out = []
  for (let i = 0; i < array.length; i += size)
    out.push(array.slice(i, i + size))
  return out
}

export function formatAmountETH(amount, decimals = 18) {
  // Convert wei to ETH with proper decimal handling
  const amountBN = BigInt(amount)
  const divisor = BigInt(10 ** decimals)
  const whole = amountBN / divisor
  const remainder = amountBN % divisor

  if (remainder === 0n) {
    return whole.toString()
  }

  // Convert remainder to decimal string with proper padding
  const remainderStr = remainder.toString().padStart(decimals, "0")
  const trimmed = remainderStr.replace(/0+$/, "")

  if (trimmed === "") {
    return whole.toString()
  }

  return `${whole}.${trimmed}`
}

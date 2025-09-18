// Get transaction hash for 2025-09-17 deposit
import fs from "fs"

const API_BASE =
  process.env.REPORT_API_BASE || "https://app.somm.finance"

async function apiFetch(path) {
  const url = `${API_BASE}${path}`
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

function toDateUTC(tsMs) {
  const d = new Date(tsMs)
  let dateStr = d.toISOString().slice(0, 10) // YYYY-MM-DD

  // Fix year typo: if date is 2024 but contract was deployed in 2025, assume it's 2025
  if (dateStr.startsWith("2024-")) {
    dateStr = dateStr.replace("2024-", "2025-")
  }

  return dateStr
}

async function getTransactionHash() {
  try {
    console.log("Fetching deposit data...")
    const data = await apiFetch(
      "/api/deposits/by-block?strategy=alpha-steth&limit=100"
    )

    console.log("=== SEARCHING FOR 2025-09-17 DEPOSITS ===")

    // Find deposits for 2025-09-17
    const deposits = data.filter((ev) => {
      const ts = Number(ev.timestamp || ev.timestampMs || ev.ts || 0)
      const day = toDateUTC(ts)
      return day === "2025-09-17"
    })

    console.log(`Found ${deposits.length} deposits for 2025-09-17`)

    deposits.forEach((deposit, i) => {
      console.log(`\n=== DEPOSIT ${i + 1} ===`)
      console.log(
        "Transaction Hash:",
        deposit.tx_hash || deposit.txHash || deposit.hash || "N/A"
      )
      console.log("Amount:", deposit.amount)
      console.log("Decimals:", deposit.decimals)
      console.log("Token:", deposit.token)
      console.log(
        "Wallet:",
        deposit.wallet || deposit.address || "N/A"
      )
      console.log(
        "Timestamp:",
        deposit.timestamp || deposit.timestampMs || deposit.ts
      )
      console.log(
        "Block:",
        deposit.block || deposit.blockNumber || "N/A"
      )
      console.log("Raw data:", JSON.stringify(deposit, null, 2))
    })
  } catch (e) {
    console.error("Error:", e.message)
  }
}

getTransactionHash()

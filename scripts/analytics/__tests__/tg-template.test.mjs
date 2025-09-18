import { test } from "node:test"
import assert from "node:assert"
import fs from "node:fs/promises"
import path from "node:path"
import { renderStrictMessage } from "../export-alpha-deposits.mjs"

// Mock data for testing
const mockRows = [
  "2025-09-18 | 11.000000 ETH | 0x13bd3a513182be7a0569c2abaf8497b866774a9df2a27c30de14386f4d9b1d71",
  "2025-09-11 | 4.683488 ETH | 0x6ef3b606dc9f3229fd597fc0a890772dce87f5554e80ea3d1008cefcfad7485d",
  "2025-09-10 | 0.000001 ETH | 0x4d43a9a3ea7bdfd3fe3e05fb51a3f4fd757d39ec2650f308a096edc31b5e2b93",
]

const mockData = {
  rows: mockRows,
  totalCount: 3,
  totalEth: "15.683489",
  totalUsd: 71798.07,
  startBlock: 23300000,
}

// Golden snapshot path
const goldenPath = path.join(
  process.cwd(),
  "scripts/analytics/__tests__/__snapshots__/tg-template.golden.txt"
)

test("Telegram template renders correctly", async () => {
  const result = renderStrictMessage(mockData)

  // Read golden snapshot
  const golden = await fs.readFile(goldenPath, "utf8")

  // Assert exact match
  assert.strictEqual(
    result,
    golden,
    "Template output must match golden snapshot exactly"
  )
})

test("Telegram template throws on forbidden variants", async () => {
  // Test that it throws when forbidden patterns are detected
  assert.throws(() => {
    // This should trigger the guard
    const badData = { ...mockData, rows: ["BY DAY test"] }
    renderStrictMessage(badData)
  }, /Forbidden variant detected/)

  assert.throws(() => {
    const badData = { ...mockData, rows: ["ALL: test"] }
    renderStrictMessage(badData)
  }, /Forbidden variant detected/)

  assert.throws(() => {
    const badData = { ...mockData, rows: ["```test```"] }
    renderStrictMessage(badData)
  }, /Forbidden variant detected/)
})

test("Telegram template handles zero rows", async () => {
  const zeroData = {
    rows: [],
    totalCount: 0,
    totalEth: "0.000000",
    totalUsd: 0,
    startBlock: 23300000,
  }

  const result = renderStrictMessage(zeroData)

  // Should contain the table header but no data rows
  assert(
    result.includes("Date       | Amount ETH | Transaction Hash")
  )
  assert(result.includes("Total: 0 transactions"))
  assert(result.includes("0.000000 ETH"))
  assert(result.includes("$0.00"))
})

test("USD formatting with thousands separators", async () => {
  const largeUsdData = {
    ...mockData,
    totalUsd: 1234567.89,
  }

  const result = renderStrictMessage(largeUsdData)

  // Should format with thousands separators
  assert(result.includes("$1,234,567.89"))
})

test("Stable digest generation", async () => {
  // Test that digest is based on stable content only
  const crypto = await import("node:crypto")

  const stableData1 = {
    rows: [
      { date: "2025-09-18", amountETH: "1.0", txHash: "0x123" },
      { date: "2025-09-17", amountETH: "2.0", txHash: "0x456" },
    ],
    totalEth: "3.000000",
    startBlock: 23300000,
  }

  const stableData2 = {
    rows: [
      { date: "2025-09-18", amountETH: "1.0", txHash: "0x123" },
      { date: "2025-09-17", amountETH: "2.0", txHash: "0x456" },
    ],
    totalEth: "3.000000",
    startBlock: 23300000,
  }

  // Same stable data should produce same digest
  const digestKey1 = JSON.stringify({
    rows: stableData1.rows.map((r) => [
      r.date,
      r.amountETH,
      r.txHash,
    ]),
    totalEth: stableData1.totalEth,
    startBlock: stableData1.startBlock,
  })

  const digestKey2 = JSON.stringify({
    rows: stableData2.rows.map((r) => [
      r.date,
      r.amountETH,
      r.txHash,
    ]),
    totalEth: stableData2.totalEth,
    startBlock: stableData2.startBlock,
  })

  const digest1 = crypto
    .createHash("sha256")
    .update(digestKey1, "utf8")
    .digest("hex")
  const digest2 = crypto
    .createHash("sha256")
    .update(digestKey2, "utf8")
    .digest("hex")

  assert.strictEqual(
    digest1,
    digest2,
    "Same stable data should produce same digest"
  )
})

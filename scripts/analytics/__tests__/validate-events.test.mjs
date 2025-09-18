// Unit tests for validate-events.mjs
import { validateEvents } from "../validate-events.mjs"

// Test fixtures
const goodEvent = {
  chainId: 1,
  txHash:
    "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  ethAddress: "0x1234567890123456789012345678901234567890",
  domain: "app.somm.finance",
  sessionId: "prod-session-123",
  blockNumber: 21000000, // Higher than typical start block
  amount: "1000000000000000000",
  decimals: 18,
  token: "ETH",
  timestamp: 1735000000000, // Timestamp consistent with block 19000000 (around 2025-01-01)
}

const mockEvent = {
  chainId: 1,
  txHash:
    "0xdeadbeef00000000000000000000000000000000000000000000000000000004",
  ethAddress: "0x4444444444444444444444444444444444444444",
  domain: "localhost",
  sessionId: "local-test-session",
  blockNumber: 21000004,
  amount: "420000000000000000",
  decimals: 18,
  token: "ETH",
  timestamp: 1726533000000,
}

const edgeEvent = {
  chainId: 2, // Wrong chain
  txHash:
    "0x0000000000000000000000000000000000000000000000000000000000000000", // All zeros
  ethAddress: "0x1111111111111111111111111111111111111111", // Repeating pattern
  domain: "example.com", // Non-production domain
  sessionId: "test-session", // Test pattern
  blockNumber: -1, // Invalid block
  amount: "0", // Zero amount
  decimals: -1, // Invalid decimals
  token: "INVALID", // Invalid token
  timestamp: "invalid", // Invalid timestamp
}

// Test cases
console.log("🧪 Running validation tests...\n")

// Test 1: Good event should pass
console.log("Test 1: Good event validation")
const goodResult = validateEvents([goodEvent], {
  apiBase: "https://app.somm.finance",
  // Skip block validation for testing
})
console.log("✅ Good event result:", goodResult.ok ? "PASS" : "FAIL")
if (!goodResult.ok) {
  console.log("   Errors:", goodResult.errors)
  console.log("   Violations:", goodResult.violations)
}
console.log("")

// Test 2: Mock event should fail
console.log("Test 2: Mock event validation")
const mockResult = validateEvents([mockEvent], {
  apiBase: "https://app.somm.finance",
  latestBlock: 20000000,
  minBlock: 18000000,
})
console.log(
  "✅ Mock event result:",
  !mockResult.ok
    ? "PASS (correctly failed)"
    : "FAIL (should have failed)"
)
if (mockResult.ok) {
  console.log("   ❌ Mock event should have failed but didn't!")
} else {
  console.log(
    "   ✅ Mock event correctly failed with",
    mockResult.violations.length,
    "violations"
  )
}
console.log("")

// Test 3: Edge case event should fail
console.log("Test 3: Edge case event validation")
const edgeResult = validateEvents([edgeEvent], {
  apiBase: "https://app.somm.finance",
  latestBlock: 20000000,
  minBlock: 18000000,
})
console.log(
  "✅ Edge event result:",
  !edgeResult.ok
    ? "PASS (correctly failed)"
    : "FAIL (should have failed)"
)
if (edgeResult.ok) {
  console.log("   ❌ Edge event should have failed but didn't!")
} else {
  console.log(
    "   ✅ Edge event correctly failed with",
    edgeResult.violations.length,
    "violations"
  )
}
console.log("")

// Test 4: Non-production API base should fail
console.log("Test 4: Non-production API base validation")
const badApiResult = validateEvents([goodEvent], {
  apiBase: "https://example.com",
  latestBlock: 20000000,
  minBlock: 18000000,
})
console.log(
  "✅ Bad API result:",
  !badApiResult.ok
    ? "PASS (correctly failed)"
    : "FAIL (should have failed)"
)
if (badApiResult.ok) {
  console.log("   ❌ Bad API should have failed but didn't!")
} else {
  console.log(
    "   ✅ Bad API correctly failed with",
    badApiResult.errors.length,
    "errors"
  )
}
console.log("")

// Test 5: Empty events array should fail
console.log("Test 5: Empty events validation")
const emptyResult = validateEvents([], {
  apiBase: "https://app.somm.finance",
})
console.log(
  "✅ Empty events result:",
  !emptyResult.ok
    ? "PASS (correctly failed)"
    : "FAIL (should have failed)"
)
if (emptyResult.ok) {
  console.log("   ❌ Empty events should have failed but didn't!")
} else {
  console.log("   ✅ Empty events correctly failed")
}
console.log("")

// Test 6: Mixed events (some good, some bad)
console.log("Test 6: Mixed events validation")
const mixedResult = validateEvents([goodEvent, mockEvent], {
  apiBase: "https://app.somm.finance",
  latestBlock: 20000000,
  minBlock: 18000000,
})
console.log(
  "✅ Mixed events result:",
  !mixedResult.ok
    ? "PASS (correctly failed)"
    : "FAIL (should have failed)"
)
if (mixedResult.ok) {
  console.log("   ❌ Mixed events should have failed but didn't!")
} else {
  console.log(
    "   ✅ Mixed events correctly failed with",
    mixedResult.violations.length,
    "violations"
  )
}
console.log("")

// Summary
const allTestsPassed =
  goodResult.ok &&
  !mockResult.ok &&
  !edgeResult.ok &&
  !badApiResult.ok &&
  !emptyResult.ok &&
  !mixedResult.ok

console.log("=".repeat(50))
console.log("🎯 Test Summary:")
console.log(
  "   Good event validation:",
  goodResult.ok ? "✅ PASS" : "❌ FAIL"
)
console.log(
  "   Mock event rejection:",
  !mockResult.ok ? "✅ PASS" : "❌ FAIL"
)
console.log(
  "   Edge case rejection:",
  !edgeResult.ok ? "✅ PASS" : "❌ FAIL"
)
console.log(
  "   Bad API rejection:",
  !badApiResult.ok ? "✅ PASS" : "❌ FAIL"
)
console.log(
  "   Empty events rejection:",
  !emptyResult.ok ? "✅ PASS" : "❌ FAIL"
)
console.log(
  "   Mixed events rejection:",
  !mixedResult.ok ? "✅ PASS" : "❌ FAIL"
)
console.log("")
console.log(
  "Overall result:",
  allTestsPassed ? "✅ ALL TESTS PASSED" : "❌ SOME TESTS FAILED"
)

if (!allTestsPassed) {
  process.exit(1)
}

// scripts/analytics/validate-events.mjs
// Production data validation for Alpha stETH deposits

// Enforce start block for Alpha stETH contract
const START_BLOCK_ALPHA_STETH = Number(
  process.env.START_BLOCK_ALPHA_STETH || NaN
)
if (!Number.isFinite(START_BLOCK_ALPHA_STETH)) {
  throw new Error(
    "START_BLOCK_ALPHA_STETH is required. Run pnpm discover:startblock:alpha and set env."
  )
}

// Denylist patterns for transaction hashes
const DENY_TX_PATTERNS = [
  /deadbeef/i,
  /^0x0+$/i,
  /(1111|2222|3333|4444){4}/i,
  /cafe/i,
  /beef/i,
  /feed/i,
  /(aaaa|bbbb|cccc|dddd){4}/i,
]

// Denylist patterns for addresses
const DENY_ADDR_PATTERNS = [
  /(1111|2222|3333|4444){10}/i,
  /^0x0+$/i,
  /(aaaa|bbbb|cccc|dddd){10}/i,
]

// Denylist patterns for session IDs
const DENY_SESSION_PATTERNS = [
  /test/i,
  /mock/i,
  /local/i,
  /dev/i,
  /staging/i,
  /sandbox/i,
]

// Production domain patterns
const PROD_DOMAINS = [
  /\.somm\.finance$/i,
  /\.sommelier\.finance$/i,
  /^app\.somm\.finance$/i,
  /^app\.sommelier\.finance$/i,
  /\.vercel\.app$/i, // Allow Vercel preview domains for now
]

// Allowed tokens for Alpha stETH strategy
const ALLOWED_TOKENS = ["ETH", "WETH", "stETH"]

// Block time validation window (5 minutes in milliseconds)
const BLOCK_TIME_WINDOW_MS = 5 * 60 * 1000

/**
 * Validate a single event against production data requirements
 */
function validateEvent(event, context = {}) {
  const errors = []
  const { latestBlock, minBlock } = context
  const ctx = `tx=${event.txHash} wallet=${event.ethAddress}`

  // Chain ID validation
  if (event.chainId !== 1) {
    errors.push(
      `${ctx} - invalid chainId ${event.chainId}, expected 1`
    )
  }

  // Transaction hash validation
  if (!event.txHash) {
    errors.push(`${ctx} - missing txHash`)
  } else if (!/^0x[a-fA-F0-9]{64}$/.test(event.txHash)) {
    errors.push(`${ctx} - invalid txHash format, must be 66-char hex`)
  } else if (DENY_TX_PATTERNS.some((rx) => rx.test(event.txHash))) {
    errors.push(`${ctx} - txHash matches denylist pattern`)
  }

  // Address validation
  if (!event.ethAddress) {
    errors.push(`${ctx} - missing ethAddress`)
  } else if (!/^0x[a-fA-F0-9]{40}$/.test(event.ethAddress)) {
    errors.push(
      `${ctx} - invalid address format, must be 40-char hex`
    )
  } else if (
    DENY_ADDR_PATTERNS.some((rx) => rx.test(event.ethAddress))
  ) {
    errors.push(`${ctx} - address matches denylist pattern`)
  }

  // Domain validation
  if (!event.domain) {
    errors.push(`${ctx} - missing domain`)
  } else if (!PROD_DOMAINS.some((rx) => rx.test(event.domain))) {
    errors.push(`${ctx} - non-production domain: ${event.domain}`)
  }

  // Session ID validation
  if (
    event.sessionId &&
    DENY_SESSION_PATTERNS.some((rx) =>
      rx.test(String(event.sessionId))
    )
  ) {
    errors.push(
      `${ctx} - sessionId matches denylist pattern: ${event.sessionId}`
    )
  }

  // Block number validation
  if (
    !Number.isInteger(event.blockNumber) ||
    event.blockNumber <= 0
  ) {
    errors.push(`${ctx} - invalid blockNumber: ${event.blockNumber}`)
  } else {
    // Enforce start block for Alpha stETH contract
    if (event.blockNumber < START_BLOCK_ALPHA_STETH) {
      errors.push(
        `${ctx} - block ${event.blockNumber} < START_BLOCK_ALPHA_STETH=${START_BLOCK_ALPHA_STETH}`
      )
    }

    if (typeof latestBlock === "number") {
      if (event.blockNumber > latestBlock) {
        errors.push(
          `${ctx} - blockNumber ${event.blockNumber} in the future (latest: ${latestBlock})`
        )
      }
      if (
        typeof minBlock === "number" &&
        event.blockNumber < minBlock
      ) {
        errors.push(
          `${ctx} - blockNumber ${event.blockNumber} older than window (min: ${minBlock})`
        )
      }
    }
  }

  // Amount validation
  const amount = Number(event.amount)
  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push(`${ctx} - invalid amount: ${event.amount}`)
  }

  // Decimals validation
  if (
    !Number.isInteger(event.decimals) ||
    event.decimals < 0 ||
    event.decimals > 36
  ) {
    errors.push(`${ctx} - invalid decimals: ${event.decimals}`)
  }

  // Token validation
  if (!event.token || !ALLOWED_TOKENS.includes(event.token)) {
    errors.push(
      `${ctx} - invalid token: ${
        event.token
      }, allowed: ${ALLOWED_TOKENS.join(", ")}`
    )
  }

  // Timestamp validation
  if (!event.timestamp || Number.isNaN(Number(event.timestamp))) {
    errors.push(`${ctx} - invalid timestamp: ${event.timestamp}`)
  } else {
    const timestamp = Number(event.timestamp)
    const now = Date.now()
    const eventTime = new Date(timestamp)

    // Check if timestamp is reasonable (not in the future, not too old)
    if (timestamp > now + BLOCK_TIME_WINDOW_MS) {
      errors.push(
        `${ctx} - timestamp ${eventTime.toISOString()} in the future`
      )
    }

    // Check if timestamp is within block time window
    if (typeof latestBlock === "number" && event.blockNumber) {
      // This is a simplified check - in production you'd want to verify against actual block times
      const blockTimeEstimate =
        now - (latestBlock - event.blockNumber) * 12 * 1000 // ~12s per block
      if (
        Math.abs(timestamp - blockTimeEstimate) > BLOCK_TIME_WINDOW_MS
      ) {
        errors.push(
          `${ctx} - timestamp ${eventTime.toISOString()} inconsistent with block ${
            event.blockNumber
          }`
        )
      }
    }
  }

  return errors
}

/**
 * Validate API base URL is production
 */
function validateApiBase(apiBase) {
  const errors = []

  if (!apiBase) {
    errors.push("REPORT_API_BASE environment variable not set")
    return errors
  }

  try {
    const url = new URL(apiBase)
    const isProdHost = PROD_DOMAINS.some((rx) =>
      rx.test(url.hostname)
    )

    if (!isProdHost) {
      errors.push(`API base not allowed for production: ${apiBase}`)
    }

    if (url.protocol !== "https:") {
      errors.push(`API base must use HTTPS: ${apiBase}`)
    }
  } catch (e) {
    errors.push(`Invalid API base URL: ${apiBase} - ${e.message}`)
  }

  return errors
}

/**
 * Main validation function
 */
export function validateEvents(events, context = {}) {
  const { apiBase, latestBlock, minBlock } = context
  const errors = []

  // Validate API base
  if (apiBase) {
    errors.push(...validateApiBase(apiBase))
  }

  // Validate events array
  if (!Array.isArray(events)) {
    errors.push("Events must be an array")
    return { ok: false, errors, violations: [] }
  }

  if (events.length === 0) {
    errors.push("No events found - empty dataset")
    return { ok: false, errors, violations: [] }
  }

  // Validate each event
  const violations = []
  for (const event of events) {
    const eventErrors = validateEvent(event, {
      latestBlock,
      minBlock,
    })
    if (eventErrors.length > 0) {
      violations.push({
        event: {
          txHash: event.txHash,
          ethAddress: event.ethAddress,
          domain: event.domain,
          blockNumber: event.blockNumber,
        },
        errors: eventErrors,
      })
    }
  }

  const totalErrors = errors.length + violations.length
  const ok = totalErrors === 0

  return {
    ok,
    errors,
    violations,
    summary: {
      totalEvents: events.length,
      violations: violations.length,
      errorCount: totalErrors,
    },
  }
}

/**
 * Generate validation failure report
 */
export function generateValidationReport(validationResult) {
  const { errors, violations, summary } = validationResult

  let report = `# Validation Failed\n\n`
  report += `**Summary:**\n`
  report += `- Total events: ${summary.totalEvents}\n`
  report += `- Violations: ${summary.violations}\n`
  report += `- Total errors: ${summary.errorCount}\n\n`

  if (errors.length > 0) {
    report += `## Configuration Errors\n\n`
    errors.forEach((error) => {
      report += `- ${error}\n`
    })
    report += `\n`
  }

  if (violations.length > 0) {
    report += `## Event Violations\n\n`
    violations.forEach((violation, i) => {
      report += `### Violation ${i + 1}\n\n`
      report += `**Event:**\n`
      report += `- Transaction: ${violation.event.txHash}\n`
      report += `- Address: ${violation.event.ethAddress}\n`
      report += `- Domain: ${violation.event.domain}\n`
      report += `- Block: ${violation.event.blockNumber}\n\n`
      report += `**Errors:**\n`
      violation.errors.forEach((error) => {
        report += `- ${error}\n`
      })
      report += `\n`
    })
  }

  return report
}

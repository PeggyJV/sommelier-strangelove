# Production Data Validation Guide

This guide provides manual validation commands to ensure the Alpha stETH deposits report uses only real production data.

## Quick Validation Script

Run the comprehensive validation script:

```bash
./scripts/analytics/validate-prod-data.sh
```

## Manual CLI Commands

### 1. Fetch and Count Events

```bash
# Count total events from production API
curl -fsS https://app.somm.finance/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100 | jq 'length'
```

### 2. Check for Denylist Patterns

```bash
# Check for test/mock patterns (should return 0)
curl -fsS https://app.somm.finance/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100 \
| jq '[ .[] | select(
  (.txHash|test("deadbeef";"i")) or
  (.domain|test("localhost")) or
  (.sessionId|test("test|mock|local|dev";"i")) or
  (.ethAddress|test("(1111|2222|3333|4444){8}";"i"))
) ] | length'
```

### 3. Validate Production Domains

```bash
# Check for non-production domains (should return 0)
curl -fsS https://app.somm.finance/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100 \
| jq '[ .[] | select(.domain | test("^(?!.*\\.somm\\.finance$)(?!.*\\.sommelier\\.finance$)(?!^app\\.somm\\.finance$)(?!^app\\.sommelier\\.finance$).*$")) ] | length'
```

### 4. Verify Chain ID

```bash
# Check for correct chain ID (should return 0)
curl -fsS https://app.somm.finance/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100 \
| jq '[ .[] | select(.chainId != 1) ] | length'
```

### 5. Random Sample Verification

```bash
# Get a random transaction hash and verify it
TX=$(curl -fsS https://app.somm.finance/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100 | jq -r '.[0].txHash')
echo "Transaction: $TX"
echo "Etherscan: https://etherscan.io/tx/$TX"

# Check by-hash API
curl -fsS "https://app.somm.finance/api/deposits/by-hash?tx=$TX" | jq .
```

## Validation Rules

The system validates the following for every event:

### Transaction Hash

- Must be 66 characters (0x + 64 hex chars)
- Must not match denylist patterns: `deadbeef`, `cafe`, `beef`, `feed`, repeating sequences
- Must not be all zeros

### Address

- Must be 40 hex characters (0x + 40 chars)
- Must not match denylist patterns: repeating sequences like `1111...`, `2222...`, etc.
- Must not be all zeros

### Domain

- Must be a production domain ending with `.somm.finance` or `.sommelier.finance`
- Must never be `localhost`, `127.0.0.1`, or development domains

### Session ID

- Must not contain: `test`, `mock`, `local`, `dev`, `staging`, `sandbox`

### Chain ID

- Must equal `1` (Ethereum mainnet)

### Block Number

- Must be a positive integer
- Must not be in the future
- Must be within reasonable range for the report window

### Amount & Decimals

- Amount must be finite and > 0
- Decimals must be integer between 0-36

### Token

- Must be one of: `ETH`, `WETH`, `stETH`

### Timestamp

- Must be valid timestamp
- Must not be in the future
- Must be consistent with block time (±5 minutes)

## Failure Handling

When validation fails:

1. **Script exits with code 1**
2. **Validation failure report** is written to `docs/analytics/validation-fail.md`
3. **GitHub Actions workflow fails** and uploads the failure report as an artifact
4. **Telegram message is NOT sent**
5. **No reports are generated**

## Environment Variables

- `REPORT_API_BASE`: Must point to production API (default: `https://app.somm.finance`)
- `LATEST_BLOCK`: Optional latest block number for validation
- `ALLOW_EMPTY_WINDOW`: Optional flag to allow empty datasets (default: false)

## Testing Validation

To test the validation system:

```bash
# Test with production data (should pass)
REPORT_API_BASE=https://app.somm.finance node scripts/analytics/generate-alpha-deposits.mjs

# Test with localhost (should fail)
REPORT_API_BASE=http://localhost:3000 node scripts/analytics/generate-alpha-deposits.mjs
```

## Integration

The validation is automatically integrated into:

1. **Main script**: `scripts/analytics/generate-alpha-deposits.mjs`
2. **GitHub Actions**: `.github/workflows/alpha-steth-deposits.yml`
3. **Manual validation**: `scripts/analytics/validate-prod-data.sh`

The system ensures that only validated production data is used for reports and Telegram messages.

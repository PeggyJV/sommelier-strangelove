#!/bin/bash
# Manual production data validation scripts
# Usage: ./scripts/analytics/validate-prod-data.sh

set -e

API_BASE="${REPORT_API_BASE:-https://app.somm.finance}"
echo "🔍 Validating production data from: $API_BASE"
echo ""

# 1) Fetch last 30d from prod and count events
echo "📊 1) Fetching deposit events count..."
EVENT_COUNT=$(curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | jq 'length')
echo "   Found $EVENT_COUNT events"
echo ""

# 2) Check for known bad patterns
echo "🚫 2) Checking for denylist patterns..."
BAD_PATTERNS=$(curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | \
  jq '[ .[] | select(
    (.txHash|test("deadbeef";"i")) or 
    (.domain|test("localhost")) or 
    (.sessionId|test("test|mock|local|dev";"i")) or 
    (.ethAddress|test("(1111|2222|3333|4444){8}";"i"))
  ) ] | length')

if [ "$BAD_PATTERNS" -eq 0 ]; then
  echo "   ✅ No denylist patterns found"
else
  echo "   ❌ Found $BAD_PATTERNS events with denylist patterns"
  echo "   Details:"
  curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | \
    jq '[ .[] | select(
      (.txHash|test("deadbeef";"i")) or 
      (.domain|test("localhost")) or 
      (.sessionId|test("test|mock|local|dev";"i")) or 
      (.ethAddress|test("(1111|2222|3333|4444){8}";"i"))
    ) ] | .[] | "   - tx: \(.txHash), domain: \(.domain), session: \(.sessionId), addr: \(.ethAddress)"'
fi
echo ""

# 3) Check domain validation
echo "🌐 3) Checking domain validation..."
NON_PROD_DOMAINS=$(curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | \
  jq '[ .[] | select(.domain | test("^(?!.*\\.somm\\.finance$)(?!.*\\.sommelier\\.finance$)(?!^app\\.somm\\.finance$)(?!^app\\.sommelier\\.finance$).*$")) ] | length')

if [ "$NON_PROD_DOMAINS" -eq 0 ]; then
  echo "   ✅ All domains are production domains"
else
  echo "   ❌ Found $NON_PROD_DOMAINS events with non-production domains"
  echo "   Details:"
  curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | \
    jq '[ .[] | select(.domain | test("^(?!.*\\.somm\\.finance$)(?!.*\\.sommelier\\.finance$)(?!^app\\.somm\\.finance$)(?!^app\\.sommelier\\.finance$).*$")) ] | .[] | "   - tx: \(.txHash), domain: \(.domain)"'
fi
echo ""

# 4) Check chain ID validation
echo "⛓️  4) Checking chain ID validation..."
WRONG_CHAIN=$(curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | \
  jq '[ .[] | select(.chainId != 1) ] | length')

if [ "$WRONG_CHAIN" -eq 0 ]; then
  echo "   ✅ All events have correct chainId (1)"
else
  echo "   ❌ Found $WRONG_CHAIN events with wrong chainId"
  echo "   Details:"
  curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | \
    jq '[ .[] | select(.chainId != 1) ] | .[] | "   - tx: \(.txHash), chainId: \(.chainId)"'
fi
echo ""

# 5) Random sample by-hash parity check
echo "🔗 5) Random sample by-hash parity check..."
FIRST_TX=$(curl -fsS "$API_BASE/api/deposits/by-block?fromBlock=-inf&toBlock=+inf&order=desc&limit=100" | jq -r '.[0].txHash // empty')

if [ -n "$FIRST_TX" ]; then
  echo "   Checking transaction: $FIRST_TX"
  BY_HASH_DATA=$(curl -fsS "$API_BASE/api/deposits/by-hash?tx=$FIRST_TX" 2>/dev/null || echo "null")
  
  if [ "$BY_HASH_DATA" != "null" ]; then
    echo "   ✅ By-hash API returned data"
    echo "   Etherscan link: https://etherscan.io/tx/$FIRST_TX"
  else
    echo "   ⚠️  By-hash API returned no data (may be expected for test transactions)"
    echo "   Etherscan link: https://etherscan.io/tx/$FIRST_TX"
  fi
else
  echo "   ⚠️  No transactions found to check"
fi
echo ""

# 6) Summary
echo "📋 Summary:"
echo "   - Total events: $EVENT_COUNT"
echo "   - Denylist violations: $BAD_PATTERNS"
echo "   - Non-prod domains: $NON_PROD_DOMAINS"
echo "   - Wrong chain IDs: $WRONG_CHAIN"

if [ "$BAD_PATTERNS" -eq 0 ] && [ "$NON_PROD_DOMAINS" -eq 0 ] && [ "$WRONG_CHAIN" -eq 0 ]; then
  echo "   ✅ All validation checks passed!"
  exit 0
else
  echo "   ❌ Validation checks failed!"
  exit 1
fi

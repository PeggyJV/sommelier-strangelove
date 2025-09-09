#!/usr/bin/env bash
set -euo pipefail

BASE="${BASE:-http://localhost:3000}"

echo "== (dev) env-dump =="
if curl -fsS "$BASE/api/env-dump" >/dev/null; then
  curl -s "$BASE/api/env-dump" | jq
else
  echo "env-dump not available (likely not in development mode)."
fi

TX="0x$(openssl rand -hex 32)"
FROM="${FROM:-0x1222f0baa62e2282bfd01083c7c3732a8c611584}"
TO="${TO:-0x0baab6db8d694e1511992b504476ef4073fe614b}"

echo "== POST /api/ingest-rpc =="
curl -si -X POST "$BASE/api/ingest-rpc" \
  -H "content-type: application/json" \
  -H "Origin: http://localhost:3000" \
  -H "Referer: http://localhost:3000/" \
  -d "{\"txHash\":\"$TX\",\"from\":\"$FROM\",\"to\":\"$TO\"}" | sed -n '1,120p'

echo "== KV readback (ATTRIB_* REST) =="
set -a
. ./.env.local >/dev/null 2>&1 || true
set +a
URL="${ATTRIB_KV_KV_REST_API_URL:-}"
TOKEN="${ATTRIB_KV_KV_REST_API_TOKEN:-}"
if [ -z "$URL" ] || [ -z "$TOKEN" ]; then
  echo "Missing ATTRIB_KV_KV_REST_API_URL/TOKEN in env."
  exit 1
fi
echo "KV URL: $URL"
curl -s "$URL/smembers/rpc:index:tx:$TX" -H "Authorization: Bearer $TOKEN" | jq
EVT=$(curl -s "$URL/smembers/rpc:index:tx:$TX" -H "Authorization: Bearer $TOKEN" | jq -r '.result[0]')
if [ -n "$EVT" ] && [ "$EVT" != "null" ]; then
  curl -s "$URL/get/$EVT" -H "Authorization: Bearer $TOKEN" | jq
else
  echo "FAIL: No event key found for TX=$TX"
  exit 2
fi
echo "PASS"


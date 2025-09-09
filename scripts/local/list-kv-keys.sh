#!/usr/bin/env bash
set -euo pipefail

URL="${ATTRIB_KV_KV_REST_API_URL:-${KV_REST_API_URL:-}}"
TOKEN="${ATTRIB_KV_KV_REST_API_TOKEN:-${KV_REST_API_TOKEN:-}}"

if [[ -z "${URL}" || -z "${TOKEN}" ]]; then
  echo "Missing KV REST credentials. Set ATTRIB_KV_KV_REST_API_URL/TOKEN or KV_REST_API_URL/TOKEN." >&2
  exit 1
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required. Install with: brew install jq" >&2
  exit 1
fi

CURSOR="0"
COUNT="${COUNT:-1000}"
MATCH="${MATCH:-*}"

TOTAL=0
while :; do
  RESP="$(curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/SCAN/${CURSOR}/MATCH/${MATCH}/COUNT/${COUNT}")"
  NEXT="$(printf '%s' "$RESP" | jq -r '.result[0]')"
  printf '%s' "$RESP" | jq -r '.result[1][]' || true
  BATCH="$(printf '%s' "$RESP" | jq -r '.result[1] | length')"
  TOTAL=$((TOTAL + BATCH))
  CURSOR="${NEXT}"
  [[ "${CURSOR}" == "0" ]] && break
  sleep 0.05
done

echo "Total keys: ${TOTAL}" >&2



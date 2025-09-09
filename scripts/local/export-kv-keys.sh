#!/usr/bin/env bash
set -euo pipefail

OUT_PATH="${1:-/Users/henriots/Desktop/kv-keys.txt}"
MATCH="${MATCH:-*}"
COUNT="${COUNT:-1000}"

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

encode() { printf '%s' "$1" | jq -sRr @uri; }
req() { curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/$1"; }

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

> "$TMP_FILE"
CURSOR=0
while :; do
  RESP="$(req "SCAN/${CURSOR}/MATCH/$(encode "$MATCH")/COUNT/${COUNT}")"
  CURSOR="$(printf '%s' "$RESP" | jq -r '.result[0]')"
  printf '%s' "$RESP" | jq -r '.result[1][]?' >> "$TMP_FILE"
  [[ "$CURSOR" == "0" ]] && break
done

mv "$TMP_FILE" "$OUT_PATH"
echo "Exported $(wc -l < "$OUT_PATH") keys to $OUT_PATH" >&2



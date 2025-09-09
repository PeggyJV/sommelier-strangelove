#!/usr/bin/env bash
set -euo pipefail

OUT_FILE="${1:-/Users/henriots/Desktop/kv-events-report.csv}"
BATCH_SIZE="${BATCH_SIZE:-200}"
COUNT="${COUNT:-2000}"

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

encode(){ printf '%s' "$1" | jq -sRr @uri; }
req(){ curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/$1"; }
csv(){ jq -rn --arg v "$1" '$v|tostring|gsub("\"";"\"\"")|"\""+.+"\""'; }

TMP_KEYS="$(mktemp)"; trap 'rm -f "$TMP_KEYS"' EXIT
> "$TMP_KEYS"

# 1) SCAN only rpc:evt:* keys
CURSOR=0
MATCH="rpc:evt:*"
while :; do
  RESP="$(req "SCAN/${CURSOR}/MATCH/$(encode "$MATCH")/COUNT/${COUNT}")"
  CURSOR="$(printf '%s' "$RESP" | jq -r '.result[0]')"
  printf '%s' "$RESP" | jq -r '.result[1][]?' >> "$TMP_KEYS"
  [[ "$CURSOR" == "0" ]] && break
done

# 2) Write CSV header
{
  echo "key,stage,domain,pagePath,sessionId,chainId,method,paramsRedacted,timestampMs"

  # 3) Batch MGET
  mapfile -t ALL_KEYS < "$TMP_KEYS"
  total=${#ALL_KEYS[@]}
  idx=0
  while [[ $idx -lt $total ]]; do
    end=$(( idx + BATCH_SIZE ))
    [[ $end -gt $total ]] && end=$total
    KEYS_BATCH=("${ALL_KEYS[@]:idx:end-idx}")
    # Build MGET path segments
    PATH="MGET"
    for k in "${KEYS_BATCH[@]}"; do
      PATH+="/$(encode "$k")"
    done
    RESP="$(req "$PATH")"
    # RESP.result is an array of values or nulls in the same order
    i=0
    printf '%s' "$RESP" | jq -cr '.result[]' | while read -r VAL; do
      KEY="${KEYS_BATCH[$i]}"; i=$((i+1))
      if [[ "$VAL" == "null" ]]; then
        continue
      fi
      # Try parse JSON; if fails, skip (non-JSON string events shouldn't happen)
      if ! echo "$VAL" | jq -e . >/dev/null 2>&1; then
        continue
      fi
      STAGE=$(echo "$VAL" | jq -r '.stage // empty')
      DOMAIN=$(echo "$VAL" | jq -r '.domain // empty')
      PAGE=$(echo "$VAL" | jq -r '.pagePath // empty')
      SESSION=$(echo "$VAL" | jq -r '.sessionId // empty')
      CHAIN=$(echo "$VAL" | jq -r '.chainId // empty')
      METHOD=$(echo "$VAL" | jq -r '.method // empty')
      PARAMS=$(echo "$VAL" | jq -c '.paramsRedacted // empty')
      TS=$(echo "$VAL" | jq -r '.timestampMs // empty')
      printf "%s,%s,%s,%s,%s,%s,%s,%s,%s\n" \
        "$(csv "$KEY")" \
        "$(csv "$STAGE")" \
        "$(csv "$DOMAIN")" \
        "$(csv "$PAGE")" \
        "$(csv "$SESSION")" \
        "$(csv "$CHAIN")" \
        "$(csv "$METHOD")" \
        "$(csv "$PARAMS")" \
        "$(csv "$TS")"
    done >> "$OUT_FILE"
    # polite throttle
    sleep 0.05
    idx=$end
  done
} > "$OUT_FILE.tmp"

mv "$OUT_FILE.tmp" "$OUT_FILE"
echo "Wrote $OUT_FILE" >&2



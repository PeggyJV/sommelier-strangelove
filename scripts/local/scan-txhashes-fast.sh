#!/usr/bin/env bash
set -euo pipefail

OUT_CSV="${1:-/Users/henriots/Desktop/kv-events-with-txhash.csv}"
OUT_SUMMARY="${2:-/Users/henriots/Desktop/kv-events-with-txhash-summary.txt}"
BATCH_SIZE="${BATCH_SIZE:-150}"
COUNT="${COUNT:-2000}"

URL="${ATTRIB_KV_KV_REST_API_URL:-${KV_REST_API_URL:-}}"
TOKEN="${ATTRIB_KV_KV_REST_API_TOKEN:-${KV_REST_API_TOKEN:-}}"
[ -n "$URL" ] && [ -n "$TOKEN" ] || { echo "Missing KV REST envs" >&2; exit 1; }
# Resolve jq path for non-interactive shells
JQ="${JQ:-}"
if [ -z "$JQ" ]; then
  if command -v jq >/dev/null 2>&1; then JQ="$(command -v jq)";
  elif [ -x /opt/homebrew/bin/jq ]; then JQ="/opt/homebrew/bin/jq";
  elif [ -x /usr/local/bin/jq ]; then JQ="/usr/local/bin/jq";
  else echo "jq not found" >&2; exit 1; fi
fi

encode(){ printf '%s' "$1" | "$JQ" -sRr @uri; }
req(){ curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/$1"; }
csv(){ "$JQ" -rn --arg v "$1" '$v|tostring|gsub("\"";"\"\"")|"\""+.+"\""'; }

TMP_KEYS="$(mktemp)"; RM="/bin/rm"; [ -x "$RM" ] || RM="rm"; trap '"$RM" -f "$TMP_KEYS"' EXIT
> "$TMP_KEYS"

# Collect all rpc:evt:* keys
CURSOR=0
MATCH="rpc:evt:*"
while :; do
  RESP="$(req "SCAN/${CURSOR}/MATCH/$(encode "$MATCH")/COUNT/${COUNT}")"
  CURSOR="$(printf '%s' "$RESP" | "$JQ" -r '.result[0]')"
  printf '%s' "$RESP" | "$JQ" -r '.result[1][]?' >> "$TMP_KEYS"
  [ "$CURSOR" = "0" ] && break
done

# Write header
echo "key,txHash,stage,domain,pagePath,sessionId,chainId,method,timestampMs" > "$OUT_CSV"

# Read into an array without mapfile (POSIX)
ALL_KEYS=()
while IFS= read -r line; do ALL_KEYS+=("$line"); done < "$TMP_KEYS"
total=${#ALL_KEYS[@]}
idx=0
found=0
while [ $idx -lt $total ]; do
  end=$(( idx + BATCH_SIZE ))
  [ $end -gt $total ] && end=$total
  # Build MGET path
  PATH="MGET"
  i=$idx
  while [ $i -lt $end ]; do
    PATH+="/$(encode "${ALL_KEYS[$i]}")"
    i=$((i+1))
  done
  RESP="$(req "$PATH")"
  # Iterate results alongside keys
  i=$idx
  printf '%s' "$RESP" | "$JQ" -cr '.result[]' | while read -r VAL; do
    KEY="${ALL_KEYS[$i]}"; i=$((i+1))
    [ "$VAL" = "null" ] && continue
    # Filter only events with txHash
    TX="$(printf '%s' "$VAL" | "$JQ" -r 'try .txHash catch empty')"
    [ -z "$TX" ] && continue
    STAGE=$(echo "$VAL" | "$JQ" -r '.stage // empty')
    DOMAIN=$(echo "$VAL" | "$JQ" -r '.domain // empty')
    PAGE=$(echo "$VAL" | "$JQ" -r '.pagePath // empty')
    SESSION=$(echo "$VAL" | "$JQ" -r '.sessionId // empty')
    CHAIN=$(echo "$VAL" | "$JQ" -r '.chainId // empty')
    METHOD=$(echo "$VAL" | "$JQ" -r '.method // empty')
    TS=$(echo "$VAL" | "$JQ" -r '.timestampMs // empty')
    printf "%s,%s,%s,%s,%s,%s,%s,%s,%s\n" \
      "$(csv "$KEY")" \
      "$(csv "$TX")" \
      "$(csv "$STAGE")" \
      "$(csv "$DOMAIN")" \
      "$(csv "$PAGE")" \
      "$(csv "$SESSION")" \
      "$(csv "$CHAIN")" \
      "$(csv "$METHOD")" \
      "$(csv "$TS")" >> "$OUT_CSV"
    found=$((found+1))
  done
  sleep 0.05
  idx=$end
done

echo "events_with_txhash=$found" > "$OUT_SUMMARY"
echo "Wrote $OUT_CSV and $OUT_SUMMARY" >&2



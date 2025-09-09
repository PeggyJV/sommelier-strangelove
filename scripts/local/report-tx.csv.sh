#!/usr/bin/env bash
set -euo pipefail

OUT_DIR="scripts/local/reports"
OUT_FILE="$OUT_DIR/tx-report.csv"
MATCH_PREFIX="rpc:index:tx:"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      OUT_FILE="$2"; shift 2 ;;
    --match)
      MATCH_PREFIX="$2"; shift 2 ;;
    *) echo "Unknown arg: $1" >&2; exit 1 ;;
  esac
done

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

mkdir -p "$(dirname "$OUT_FILE")"

encode() { printf '%s' "$1" | jq -sRr @uri; }
req() { curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/$1"; }

echo "txHash,evtCount,stages,domains,pagePaths,sessionIds,chainIds,methods,firstTimestampMs,lastTimestampMs,evtIds" > "$OUT_FILE"

CURSOR=0
COUNT=1000
MATCH="${MATCH_PREFIX}*"
while :; do
  SCAN_RESP="$(req "SCAN/${CURSOR}/MATCH/$(encode "$MATCH")/COUNT/${COUNT}")"
  CURSOR="$(printf '%s' "$SCAN_RESP" | jq -r '.result[0]')"
  KEYS="$(printf '%s' "$SCAN_RESP" | jq -r '.result[1][]?')"
  if [[ -n "$KEYS" ]]; then
    while IFS= read -r K; do
      [[ -z "$K" ]] && continue
      K_ENC="$(encode "$K")"
      SMEM="$(req "SMEMBERS/${K_ENC}")" || true
      EVT_IDS="$(printf '%s' "$SMEM" | jq -r '.result[]?')"
      if [[ -z "$EVT_IDS" ]]; then
        TX_HASH="${K#rpc:index:tx:}"
        echo "$TX_HASH,0,,,,,,,," >> "$OUT_FILE"
        continue
      fi
      # Aggregate
      TMP_JSON='[]'
      FIRST=9999999999999
      LAST=0
      while IFS= read -r EID; do
        E_ENC="$(encode "$EID")"
        GET_RESP="$(req "GET/${E_ENC}")" || true
        VAL="$(printf '%s' "$GET_RESP" | jq -c '.result? | try fromjson catch .')"
        if [[ -z "$VAL" || "$VAL" == "null" ]]; then
          continue
        fi
        TS="$(printf '%s' "$VAL" | jq -r '.timestampMs // 0')"
        (( TS < FIRST )) && FIRST=$TS
        (( TS > LAST )) && LAST=$TS
        TMP_JSON="$(jq -c --argjson obj "$VAL" '. + [$obj]' <<< "$TMP_JSON")"
      done <<< "$EVT_IDS"

      TX_HASH="${K#rpc:index:tx:}"
      EVT_COUNT="$(jq -r 'length' <<< "$TMP_JSON")"
      STAGES="$(jq -r 'map(.stage) | unique | join(";")' <<< "$TMP_JSON")"
      DOMAINS="$(jq -r 'map(.domain) | unique | join(";")' <<< "$TMP_JSON")"
      PAGES="$(jq -r 'map(.pagePath) | unique | join(";")' <<< "$TMP_JSON")"
      SESSIONS="$(jq -r 'map(.sessionId) | unique | join(";")' <<< "$TMP_JSON")"
      CHAINS="$(jq -r 'map(.chainId|tostring) | unique | join(";")' <<< "$TMP_JSON")"
      METHODS="$(jq -r 'map(.method) | unique | join(";")' <<< "$TMP_JSON")"
      EVT_IDS_JOINED="$(printf '%s' "$EVT_IDS" | tr '\n' ';')"

      # CSV-safe quoting
      csv() { jq -rn --arg v "$1" '$v|gsub("\"";"\"\"")|"\""+.+"\""'; }
      printf "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n" \
        "$TX_HASH" \
        "$EVT_COUNT" \
        "$(csv "$STAGES")" \
        "$(csv "$DOMAINS")" \
        "$(csv "$PAGES")" \
        "$(csv "$SESSIONS")" \
        "$(csv "$CHAINS")" \
        "$(csv "$METHODS")" \
        "$FIRST" \
        "$LAST" \
        >> "$OUT_FILE"
    done <<< "$KEYS"
  fi
  [[ "$CURSOR" == "0" ]] && break
done

echo "Wrote $OUT_FILE" >&2



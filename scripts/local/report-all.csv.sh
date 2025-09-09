#!/usr/bin/env bash
set -euo pipefail

OUT_FILE="${1:-/Users/henriots/Desktop/kv-all-report.csv}"
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

encode(){ printf '%s' "$1" | jq -sRr @uri; }
req(){ curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/$1"; }
csv(){ jq -rn --arg v "$1" '$v|tostring|gsub("\"";"\"\"")|"\""+.+"\""'; }

TMP_JSON="$(mktemp)"; trap 'rm -f "$TMP_JSON"' EXIT
echo '[]' > "$TMP_JSON"

# Scan all keys
CURSOR=0
while :; do
  RESP="$(req "SCAN/${CURSOR}/COUNT/${COUNT}")"
  CURSOR="$(printf '%s' "$RESP" | jq -r '.result[0]')"
  printf '%s' "$RESP" | jq -r '.result[1][]?' | while read -r K; do
    [[ -z "$K" ]] && continue
    TYPE_RESP="$(req "TYPE/$(encode "$K")")"
    T="$(printf '%s' "$TYPE_RESP" | jq -r '.result')"
    if [[ "$T" == "string" ]]; then
      G="$(req "GET/$(encode "$K")")"
      VAL="$(printf '%s' "$G" | jq -c '.result? | try fromjson catch .')"
      if [[ -z "$VAL" || "$VAL" == "null" ]]; then
        # Non-JSON string, map minimal fields
        VAL='{}'
      fi
      jq -c --arg key "$K" --arg type "$T" --argjson val "$VAL" \
        '. + [{key:$key,type:$type,evt:($val)}]' < "$TMP_JSON" > "$TMP_JSON.tmp" && mv "$TMP_JSON.tmp" "$TMP_JSON"
    elif [[ "$T" == "zset" || "$T" == "set" ]]; then
      # For indices, we don't inline all members to avoid huge CSV lines; we store count
      CARD="$(req "ZCARD/$(encode "$K")" | jq -r '.result' 2>/dev/null || true)"
      if [[ -z "$CARD" || "$CARD" == "null" ]]; then
        CARD="$(req "SCARD/$(encode "$K")" | jq -r '.result' 2>/dev/null || echo 0)"
      fi
      jq -c --arg key "$K" --arg type "$T" --argjson count "${CARD:-0}" \
        '. + [{key:$key,type:$type,count:$count}]' < "$TMP_JSON" > "$TMP_JSON.tmp" && mv "$TMP_JSON.tmp" "$TMP_JSON"
    else
      jq -c --arg key "$K" --arg type "$T" '. + [{key:$key,type:$type}]' < "$TMP_JSON" > "$TMP_JSON.tmp" && mv "$TMP_JSON.tmp" "$TMP_JSON"
    fi
  done
  [[ "$CURSOR" == "0" ]] && break
done

# Write CSV header
{
  echo "key,type,idx_wallet,idx_contract,idx_tx,evt_stage,evt_domain,evt_pagePath,evt_sessionId,evt_chainId,evt_method,evt_paramsRedacted,evt_timestampMs,count"

  jq -cr '.[]' "$TMP_JSON" | while read -r ROW; do
    KEY="$(jq -r '.key' <<< "$ROW")"
    TYPE="$(jq -r '.type' <<< "$ROW")"
    COUNT_VAL="$(jq -r '.count // empty' <<< "$ROW")"
    IDX_WALLET=""; IDX_CONTRACT=""; IDX_TX=""
    EVT_STAGE=""; EVT_DOMAIN=""; EVT_PAGE=""; EVT_SESSION=""; EVT_CHAIN=""; EVT_METHOD=""; EVT_PARAMS=""; EVT_TS=""

    if [[ "$KEY" =~ ^rpc:index:wallet: ]]; then IDX_WALLET="1"; fi
    if [[ "$KEY" =~ ^rpc:index:contract: ]]; then IDX_CONTRACT="1"; fi
    if [[ "$KEY" =~ ^rpc:index:tx: ]]; then IDX_TX="1"; fi

    if [[ "$KEY" =~ ^rpc:evt: ]]; then
      EVT_STAGE="$(jq -r '.evt.stage // empty' <<< "$ROW")"
      EVT_DOMAIN="$(jq -r '.evt.domain // empty' <<< "$ROW")"
      EVT_PAGE="$(jq -r '.evt.pagePath // empty' <<< "$ROW")"
      EVT_SESSION="$(jq -r '.evt.sessionId // empty' <<< "$ROW")"
      EVT_CHAIN="$(jq -r '.evt.chainId // empty' <<< "$ROW")"
      EVT_METHOD="$(jq -r '.evt.method // empty' <<< "$ROW")"
      EVT_PARAMS="$(jq -c '.evt.paramsRedacted // empty' <<< "$ROW")"
      EVT_TS="$(jq -r '.evt.timestampMs // empty' <<< "$ROW")"
    fi

    printf "%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n" \
      "$(csv "$KEY")" \
      "$(csv "$TYPE")" \
      "$(csv "$IDX_WALLET")" \
      "$(csv "$IDX_CONTRACT")" \
      "$(csv "$IDX_TX")" \
      "$(csv "$EVT_STAGE")" \
      "$(csv "$EVT_DOMAIN")" \
      "$(csv "$EVT_PAGE")" \
      "$(csv "$EVT_SESSION")" \
      "$(csv "$EVT_CHAIN")" \
      "$(csv "$EVT_METHOD")" \
      "$(csv "$EVT_PARAMS")" \
      "$(csv "${EVT_TS:-$COUNT_VAL}")"
  done
} > "$OUT_FILE"

echo "Wrote $OUT_FILE" >&2



#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <KEY> [--out-dir scripts/local/snapshots]" >&2
  exit 1
fi

KEY="$1"
OUT_DIR="scripts/local/snapshots"
shift || true
while [[ $# -gt 0 ]]; do
  case "$1" in
    --out-dir)
      OUT_DIR="$2"; shift 2 ;;
    *)
      echo "Unknown arg: $1" >&2; exit 1 ;;
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

mkdir -p "$OUT_DIR"

urlencode() {
  # requires jq
  printf '%s' "$1" | jq -sRr @uri
}

request() {
  local path="$1"
  curl -sS -H "Authorization: Bearer ${TOKEN}" "${URL}/${path}"
}

ENC_KEY="$(urlencode "$KEY")"

# Discover type and TTL
TYPE_RESP="$(request "TYPE/${ENC_KEY}")"
TYPE="$(printf '%s' "$TYPE_RESP" | jq -r '.result // "none"')"
EXISTS_RESP="$(request "EXISTS/${ENC_KEY}")"
EXISTS="$(printf '%s' "$EXISTS_RESP" | jq -r '.result // 0')"
TTL_RESP="$(request "TTL/${ENC_KEY}")"
TTL="$(printf '%s' "$TTL_RESP" | jq -r '.result // -2')"
PTTL_RESP="$(request "PTTL/${ENC_KEY}")" || true
PTTL="$(printf '%s' "$PTTL_RESP" | jq -r '.result // -2')"
EXPIRETIME_RESP="$(request "EXPIRETIME/${ENC_KEY}")" || true
EXPIRETIME="$(printf '%s' "$EXPIRETIME_RESP" | jq -r '.result // -2')"
MEM_USAGE_RESP="$(request "MEMORY%20USAGE/${ENC_KEY}")" || true
MEMORY_USAGE="$(printf '%s' "$MEM_USAGE_RESP" | jq -r '.result // empty')"
OBJ_ENCODING_RESP="$(request "OBJECT%20ENCODING/${ENC_KEY}")" || true
OBJECT_ENCODING="$(printf '%s' "$OBJ_ENCODING_RESP" | jq -r '.result // empty')"
OBJ_IDLETIME_RESP="$(request "OBJECT%20IDLETIME/${ENC_KEY}")" || true
OBJECT_IDLETIME="$(printf '%s' "$OBJ_IDLETIME_RESP" | jq -r '.result // empty')"

VALUE_JSON="false"
LENGTH="null"
VALUE="null"

case "$TYPE" in
  string)
    GET_RESP="$(request "GET/${ENC_KEY}")"
    RAW_VAL="$(printf '%s' "$GET_RESP" | jq -r '.result // empty')"
    STRLEN_RESP="$(request "STRLEN/${ENC_KEY}")" || true
    STRLEN_VAL="$(printf '%s' "$STRLEN_RESP" | jq -r '.result // empty')"
    if [[ -n "$STRLEN_VAL" && "$STRLEN_VAL" != "null" ]]; then
      LENGTH="$STRLEN_VAL"
    else
      LENGTH="${#RAW_VAL}"
    fi
    if [[ -n "$RAW_VAL" ]] && echo "$RAW_VAL" | jq -e . >/dev/null 2>&1; then
      VALUE_JSON="true"
      VALUE="$(echo "$RAW_VAL" | jq -c '.')"
    else
      VALUE="$(jq -rn --arg v "$RAW_VAL" '$v')"
    fi
    ;;
  hash)
    HGETALL_RESP="$(request "HGETALL/${ENC_KEY}")"
    VALUE="$(printf '%s' "$HGETALL_RESP" | jq -c 'def toobj: reduce range(0; (.result|length); 2) as $i ({}; . + { ((.result[$i])//empty): (.result[$i+1]) }); toobj')"
    HLEN_RESP="$(request "HLEN/${ENC_KEY}")" || true
    LENGTH="$(printf '%s' "$HLEN_RESP" | jq -r '.result // empty')"
    ;;
  list)
    LRANGE_RESP="$(request "LRANGE/${ENC_KEY}/0/-1")"
    VALUE="$(printf '%s' "$LRANGE_RESP" | jq -c '.result')"
    LLEN_RESP="$(request "LLEN/${ENC_KEY}")" || true
    LENGTH="$(printf '%s' "$LLEN_RESP" | jq -r '.result // empty')"
    ;;
  set)
    SMEMBERS_RESP="$(request "SMEMBERS/${ENC_KEY}")"
    VALUE="$(printf '%s' "$SMEMBERS_RESP" | jq -c '.result')"
    SCARD_RESP="$(request "SCARD/${ENC_KEY}")" || true
    LENGTH="$(printf '%s' "$SCARD_RESP" | jq -r '.result // empty')"
    ;;
  zset)
    ZRANGE_RESP="$(request "ZRANGE/${ENC_KEY}/0/-1/WITHSCORES")"
    VALUE="$(printf '%s' "$ZRANGE_RESP" | jq -c '[range(0; (.result|length); 2) as $i | {member: .result[$i], score: ((.result[$i+1]|tonumber?) // .result[$i+1])}]')"
    ZCARD_RESP="$(request "ZCARD/${ENC_KEY}")" || true
    LENGTH="$(printf '%s' "$ZCARD_RESP" | jq -r '.result // empty')"
    ;;
  none)
    VALUE="null"
    ;;
  *)
    # Fallback: try GET as string
    GET_RESP="$(request "GET/${ENC_KEY}")" || true
    RAW_VAL="$(printf '%s' "$GET_RESP" | jq -r '.result // empty')"
    if [[ -n "$RAW_VAL" ]] && echo "$RAW_VAL" | jq -e . >/dev/null 2>&1; then
      VALUE_JSON="true"
      VALUE="$(echo "$RAW_VAL" | jq -c '.')"
    else
      VALUE="$(jq -rn --arg v "$RAW_VAL" '$v')"
    fi
    ;;
esac

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SAFE_KEY="${KEY//\//_}"
SAFE_KEY="${SAFE_KEY//:/_}"
OUT_FILE="${OUT_DIR}/${SAFE_KEY}.json"

jq -n --arg key "$KEY" \
      --arg type "$TYPE" \
      --argjson exists "$EXISTS" \
      --argjson ttl "$TTL" \
      --argjson pttl "$PTTL" \
      --argjson expiretime "$EXPIRETIME" \
      --argjson memory_usage_bytes "${MEMORY_USAGE:-null}" \
      --arg object_encoding "${OBJECT_ENCODING:-}" \
      --argjson object_idletime "${OBJECT_IDLETIME:-null}" \
      --argjson value_json "$VALUE_JSON" \
      --argjson length "${LENGTH}" \
      --argjson value "$VALUE" \
      --arg timestamp "$TIMESTAMP" \
      '{key: $key, type: $type, exists: $exists, ttl: $ttl, pttl: $pttl, expiretime: $expiretime, memory_usage_bytes: $memory_usage_bytes, object_encoding: $object_encoding, object_idletime: $object_idletime, length: $length, value_is_json: $value_json, value: $value, captured_at: $timestamp}' \
  | tee "$OUT_FILE" >/dev/null

echo "Saved snapshot to ${OUT_FILE}" >&2



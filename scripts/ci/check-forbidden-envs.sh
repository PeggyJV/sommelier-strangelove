#!/usr/bin/env bash
set -euo pipefail

echo "Checking for forbidden process.env.KV_* usages under src/ ..."
if grep -R --line-number --no-color -E 'process\.env\.KV_' src/; then
  echo "ERROR: Forbidden env usage detected (process.env.KV_*) in src/. Remove legacy KV_* references." >&2
  exit 1
fi
echo "OK: No forbidden process.env.KV_* usages found."


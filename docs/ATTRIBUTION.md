## Attribution Logging (Alpha stETH)

Purpose: capture UI‑initiated JSON‑RPC interactions (reads/writes) from somm.finance domains, attribute them to domain/page/wallet/session, and persist events in Redis/KV for ops analytics and fee attribution.

### Components
- Frontend capture: viem transport wrapper (reads) + EIP‑1193 wallet wrapper (writes)
- Ingestion API: `POST /api/ingest-rpc` (Edge/Node), per‑IP rate limit, append‑only KV, indices per day
- Reporting API: `GET /api/rpc-report` returns CSV or JSON with filters
- Domain middleware: allow only `*.somm.finance`, inject `x-somm-domain`
- Contract registry: Alpha stETH vault/accountant/teller/queue/lens + stETH/wstETH/WETH

### Environment variables
- Client
  - `NEXT_PUBLIC_ATTRIBUTION_ENABLED=true`
- Server (KV)
  - Prefer: `ATTRIB_KV_KV_REST_API_URL`, `ATTRIB_KV_KV_REST_API_TOKEN`
  - Fallback (only if ATTRIB_* missing): `KV_REST_API_URL`, `KV_REST_API_TOKEN`
- Rate limit
  - `ATTRIBUTION_RATE_LIMIT_PER_MINUTE` (default 120)

### Middleware
- Enforces origin allowlist for `*.somm.finance`
- Adds header `x-somm-domain` used in event enrichment

### Ingestion API
- `POST /api/ingest-rpc`
- Body: batch of events with stages: `request | submitted | receipt | error`
- Stored keys: `rpc:evt:<id>`, indices: `rpc:index:wallet:<addr>:YYYY-MM-DD`, `rpc:index:contract:<addr>:YYYY-MM-DD`, `rpc:index:tx:<hash>`
- Redaction: do not store raw signatures/private data; trim large params

### Reporting API
- `GET /api/rpc-report` query params:
  - `from=YYYY-MM-DD` (UTC), `to=YYYY-MM-DD` (UTC)
  - filter: `wallet=0x...` or `contract=0x...` (alias: `address`)
  - `limit=100` (applied per day window), `format=csv|json` (default csv)

Examples:
```bash
# CSV by wallet today
curl "$BASE_URL/api/rpc-report?from=$(date -u +%Y-%m-%d)&to=$(date -u +%Y-%m-%d)&wallet=0xYourWallet&limit=50&format=csv"

# JSON by contract across a day
curl "$BASE_URL/api/rpc-report?from=2025-09-05&to=2025-09-05&contract=0xef417fce1883c6653e7dc6af7c6f85ccde84aa09&limit=100&format=json"
```

### Setup (Preview)
1) Map a Preview deployment to a `*.somm.finance` subdomain (or temporarily repoint `app-stage.sommelier.finance` to Preview)
2) Ensure envs exist in Preview scope: `NEXT_PUBLIC_ATTRIBUTION_ENABLED`, `ATTRIB_KV_*`, `ATTRIBUTION_RATE_LIMIT_PER_MINUTE`
3) Deploy Preview and test (see below)

### Test plan
1) Visit Preview domain on `*.somm.finance`, open Alpha stETH page (read)
2) Perform a safe write (or simulate) via wallet
3) Fetch report and verify rows contain domain/pagePath/wallet/sessionId:
```bash
curl "$BASE_URL/api/rpc-report?from=$(date -u +%Y-%m-%d)&to=$(date -u +%Y-%m-%d)&limit=50&format=json"
```

### Privacy & security
- Never store raw signatures, mnemonics, or wallet private data
- Redact/trim large `params` fields; store only necessary attribution fields
- Domain allowlist + per‑IP rate limiting

### Known limitations / backlog
- Reorg awareness is best‑effort (events are append‑only; receipts may arrive later)
- Rate limit defaults may need tuning per environment
- Additional report groupings (by strategy) can be added later



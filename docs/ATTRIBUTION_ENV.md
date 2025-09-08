## Attribution Environment Preflight (read-only)

This script validates attribution envs across Vercel and local and performs only read‑only KV checks.

### What it checks

- Pulls Vercel envs (Preview/Production/Development) via `vercel env ls --json`.
- Confirms presence of required keys:
  - App flags:
    - `NEXT_PUBLIC_ATTRIBUTION_ENABLED`
    - `ATTRIBUTION_ALLOW_LOCAL` (local only)
    - `ATTRIBUTION_ALLOW_HOST_SUFFIXES` (Preview should include `.vercel.app`)
  - KV credentials (prefer ATTRIB*\*, fallback KV*\*):
    - `ATTRIB_KV_KV_REST_API_URL` or `KV_REST_API_URL`
    - `ATTRIB_KV_KV_REST_API_TOKEN` or `KV_REST_API_TOKEN`
- Hydrates `.env.local` with local‑only defaults if missing:
  - `NEXT_PUBLIC_ATTRIBUTION_ENABLED=true`
  - `ATTRIBUTION_ALLOW_LOCAL=true`
  - KV URL/TOKEN copied from Vercel Development or Preview if absent locally
- Connectivity checks (read‑only):
  - `GET <URL>/ping`
  - `GET <URL>/get/__attrib_probe__:<random>` (expect null-ish)

### How to run

```bash
pnpm env:attrib:check
```

### PASS looks like

- Preview/Production show KV URL host and `token: present`.
- `.env.local` already has required flags (or reports it appended them).
- `KV /ping → 200 (OK)` and the nonexistent key probe returns 200/204/404.
- Final line: `PASS: attribution envs look good; local flags set; KV ping OK.`

### FAIL next steps

- If Preview/Production list `token: missing` or `host: missing`:
  - Set `ATTRIB_KV_KV_REST_API_URL` and `ATTRIB_KV_KV_REST_API_TOKEN` in Vercel (or `KV_REST_API_*`).
  - Redeploy.
- If KV ping fails:
  - Verify `.env.local` URL/TOKEN and network egress.
- If Preview tests fail due to 403:
  - Ensure `ATTRIBUTION_ALLOW_HOST_SUFFIXES` includes `.vercel.app`.

### Safety

- Script never writes to production KV. Only `PING` and `GET` of a random, nonexistent key.
- Secrets are never printed; only hostnames and presence indicators are shown.

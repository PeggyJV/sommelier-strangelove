## Alpha stETH Manage – Analytics Proposal

Scope: Implementation plan proposals only. No code changes made.

### Recommendation summary

- Adopt Option B: Product analytics (PostHog self-hosted or Mixpanel) + minimal GA4 via server-side collector, with first‑party `/api/events` and UTM middleware. This balances UX insights with ad‑block resilience, keeps bundle thin, and provides a migration path to warehouse later.

---

### Two‑stage rollout (what we can do right now vs. improvements)

Stage 1 – Use what exists today (no code changes)

- Turn on existing client instrumentation via env only:
  - In Vercel Project Settings → Env, set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` (Preview/Prod).
  - Ensure `NEXT_PUBLIC_GTM_ID` is present (it is referenced in `_document.tsx`).
- Configure GTM to forward existing events to GA4:
  - Create a GA4 tag and a trigger for Custom Event = any of the emitted names (e.g., `deposit.succeeded`, `approve.rejected`, `wallet.disconnected`).
  - Map properties from `dataLayer` to GA4 event params (chain_id, token_symbol, vault_name, etc., when present).
- Keep `@vercel/analytics` for page-level web analytics and basic performance.
- Reporting: build GA4 Explorations for the Manage funnel and error rates; rely on Vercel Analytics for high-level traffic/perf.

What you get now

- Manage conversion and drop-off between approve → deposit.
- Error distributions from reject events.
- Per-network/per-token breakdowns (as available in payloads).

Limitations in Stage 1

- Client-only; ad blockers may suppress some GTM/GA hits.
- No attribution persistence (UTM) and limited user-level stitching.
- No wallet hashing or server enrichment.

Stage 2 – Improvements (server relay + attribution + privacy)

- Add first‑party `/api/events` relay with schema validation and retries.
- Add UTM middleware to set first‑party `somm_attrib` cookie.
- Hash wallet addresses server-side; add build id, chain id, route context.
- Optionally relay to PostHog/Mixpanel and/or GA4. Keep GTM for marketing pixels under consent.
- Add dashboards for funnel, error reasons, and attribution.

Effort

- Stage 1: 0.5–1 day (GTM+GA4 config and env toggle).
- Stage 2: 3–5 days (API route, middleware, relay, QA, dashboards).

---

### Stage 1.5 – MVP Deposits Report (use existing Upstash “snapshot”)

Goal

- Produce a simple, trustworthy deposits report for Alpha stETH: daily/weekly deposits count, sum of deposit amounts, and unique wallets.

Data source

- Use the existing Upstash/Redis database labeled “snapshot” (visible in Vercel Storage) as the read source for recorded transaction logs if they are being mirrored there. If deposit events are not yet mirrored, this stage becomes an extraction task: backfill on-chain events into the snapshot store or export directly to a CSV for the report.

Approach

- Define a stable key pattern for Alpha stETH deposit events (e.g., `tx:alpha-steth:deposit:{txHash}`) with fields: `timestamp`, `wallet`, `amount_base`, `amount_usd` (optional), `chain_id`.
- If the data already exists: scan keys by prefix and aggregate per day (UTC) into a time series.
- If not: one-off backfill job (script) reading on-chain Deposit/Transfer events for Alpha stETH and writing summarized entries to Upstash or outputting CSV for Report.

Deliverables

- CSV or JSON time series: date, deposits_count, deposits_amount_base, deposits_amount_usd (if price available), unique_wallets.
- A short markdown report (docs/analytics/mvp-deposits.md) with totals and charts pasted as images or links to a notebook.

Limitations

- Upstash scan is eventually consistent and not a warehouse; use as interim storage only.
- USD aggregation depends on pricing source at transaction time; if missing, report base-asset totals and add USD as separate column with current or hourly price as approximation.

Next

- Fold this pipeline into Stage 2 server relay or a lightweight ETL (cron) that writes daily aggregates to a durable store (object storage or warehouse).

---

### Option A – GA4 + server-side collector + UTM middleware

- Architecture
  - Client emits events to `/api/events` (Next API). Server reformats to GA4 Measurement Protocol.
  - Middleware captures UTM params on first visit; sets `somm_attrib` cookie (JSON: utm_source, medium, campaign, ref, ts).
  - Keep Vercel Analytics. GTM loads after consent only.
- Pros
  - Widely accepted, marketing friendly; integrates with Google Ads.
  - Server-side MP avoids most ad-blocking and hides keys.
  - Minimal vendor footprint on client.
- Cons
  - GA4 event model less product‑centric; funnels/cohorts weaker than Mixpanel/PostHog.
  - Requires careful quota/MP batching; debugging is harder.
  - Consent and GDPR diligence required if GTM/Ads used.
- Risks
  - Measurement Protocol drops if schemas wrong; stricter limits.
- Effort
  - M: `/api/events`, UTM middleware, consent gate, dashboards in GA4.

---

### Option B – Product analytics (PostHog or Mixpanel) + minimal GA4 [Recommended]

- Architecture
  - Client emits to `/api/events` first-party. Server relays to PostHog/Mixpanel (SDK server or HTTP), and optionally to GA4.
  - UTM middleware sets `somm_attrib` cookie (first‑party). Consent gate blocks marketing pixels; product events allowed under legitimate interest if permitted.
  - Keep Vercel Analytics for performance signals.
- Pros
  - Strong product tooling: cohorts, retention, feature flags, session replays (opt‑in), user paths.
  - Server relay reduces ad‑block loss; one place to enrich with chain/wallet context.
  - Can proxy through your domain; rotate tokens safely.
- Cons
  - Slightly more infra than pure client SDK; need retry/queue.
  - Paid tiers for scale; self‑hosting PostHog increases ops.
- Risks
  - PII leaks if wallet ↔ identity joined; guard with hashing and policy.
- Effort
  - M+: `/api/events` + relay, UTM middleware, event schema, basic dashboards.

---

### Option C – Server-only custom pipeline + warehouse later

- Architecture
  - Minimal client beacons to `/api/events`; store raw JSON in queue/KV → batch to object store (S3/GCS). dbt/BigQuery later.
- Pros
  - Full control; lowest vendor lock‑in; strongest ad‑block resilience.
  - Cost control; transform offline.
- Cons
  - No immediate product UI; dashboards require BI setup.
  - Longer time-to-insight; more maintenance.
- Effort
  - M–L: build storage, retention, privacy tooling; add BI later.

---

### Minimal event schema draft (Alpha stETH Manage)

Common properties

- `vault`: "Alpha-stETH"
- `chain_id`, `network`: e.g., 1 / "ethereum"
- `address_hash`: sha256(wallet) – no plaintext wallet
- `session_id`, `utm`: from `somm_attrib` cookie
- `client_ts`, `build_id`

Events

- `page_view` – { route: "/strategies/[id]/manage" }
- `wallet_connected` / `wallet_disconnected`
- `chain_switch_opened` / `chain_switch_attempted` / `chain_switch_succeeded` / `chain_switch_failed`
- `token_selected` – { symbol }
- `amount_changed` – { amount, symbol }
- `approve_clicked` / `approve_submitted` / `approve_succeeded` / `approve_rejected` – include `tx_hash` when available
- `deposit_clicked` / `deposit_submitted` / `deposit_succeeded` / `deposit_rejected`
- `tooltip_opened` – { id } (APY, Net Value, Fees)
- `error_shown` – from centralized handler { code, message_sanitized }

### Attribution plan

- Middleware captures UTM params (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `ref`, `src`) and sets `somm_attrib` cookie (httpOnly, sameSite=Lax, 7–30 day TTL).
- Events include cookie payload server-side, not client-accessible.

### Privacy & consent

- No PII beyond hashed wallet. Do not send ENS names or emails.
- Consent banner gates GTM/marketing pixels; product analytics may run under legitimate interest where applicable (confirm with counsel).
- DSR handling: deletion by address hash; store salt securely.

### Rollout plan

1. Foundations (day 0–2)

- Add `/api/events` (server relay with JSON schema validation) and UTM middleware.
- Feature-flag event emission; ship no-op client until enabled.

2. Instrument core events (day 3–4)

- Wire wallet/chain, approve/deposit flows, and errors using existing `analytics.track` wrapper (redirect to server).

3. Verify (day 5)

- QA in Preview: verify cookies, payloads, retry/backoff, and dashboards.
- Synthetic tests for event coverage in Playwright.

4. Consent & marketing (day 6+)

- Enable GTM post‑consent; map server-forwarded events to GA4 if needed.

5. Hardening (week 2)

- Add queue (e.g., Vercel KV/Redis or durable object), batching, and backpressure. Add PII guardrails and schema versioning.

### Success metrics & dashboards

- Funnel: connect → approve → deposit (rate and time to complete).
- Error rates: approval/transaction rejections by reason.
- Conversion by `utm_source/medium/campaign`.
- Performance vitals on Manage page (INP, TBT proxy) and correlation to conversion.

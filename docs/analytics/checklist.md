## Alpha stETH Manage – Analytics Checklist

Phase 1 – Foundations

- [ ] Add `/api/events` server route with JSON schema validation and request IP/user-agent capture.
- [ ] Add UTM middleware to set `somm_attrib` httpOnly cookie (TTL 30d, SameSite=Lax).
- [ ] Hash wallet addresses (sha256 with salt) server-side before forwarding.
- [ ] Env flags: `NEXT_PUBLIC_ANALYTICS_ENABLED`, `PRODUCT_ANALYTICS_WRITE_KEY`, `GA4_MEASUREMENT_ID`, `GA4_API_SECRET` (if GA4 relay), `EVENTS_SALT`.

Phase 2 – Instrument Manage view

- [ ] `page_view` on `/strategies/[id]/manage` with vault meta.
- [ ] Wallet: `wallet_connected`, `wallet_disconnected`.
- [ ] Chain switch: opened/attempted/succeeded/failed.
- [ ] Token: `token_selected`.
- [ ] Amount: `amount_changed` (throttle).
- [ ] Approve: clicked/submitted/succeeded/rejected (tx hash if available).
- [ ] Deposit: clicked/submitted/succeeded/rejected (tx hash if available).
- [ ] Errors: wire centralized handler to `error_shown` with sanitized message/code.

QA – Local/Preview/Prod

- [ ] Verify cookie written with UTM on first hit and persists across routes.
- [ ] Confirm event payload enrichment server-side (address hash, build id, attrib).
- [ ] Simulate ad-blockers (uBlock, Brave) and confirm events via server still arrive.
- [ ] Ensure consent banner blocks GTM tags until accepted; product events policy reviewed.
- [ ] Playwright: add e2e that connects wallet (mock), selects token, enters amount, fires approve/deposit stubs, and asserts events posted.

Monitoring & Alerting

- [ ] 4xx/5xx rate on `/api/events` in Vercel logs/alerts.
- [ ] Dead-letter queue or error store for failed relays.
- [ ] Dashboard: conversion funnel and error rate by reason.

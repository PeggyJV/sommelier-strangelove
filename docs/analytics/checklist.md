## Alpha stETH Manage – Analytics Checklist

### ✅ COMPLETED - Stage 1.5 MVP Deposits Report

- [x] **Vercel KV-backed API**: `/api/deposits/by-block` endpoint implemented
- [x] **Production Data Validation**: Strict validation layer with start block enforcement
- [x] **Telegram Integration**: Automated reporting with idempotency protection
- [x] **Multiple Export Formats**: JSON, CSV, and Markdown reports generated
- [x] **GitHub Actions Workflows**: Automated daily reports and manual export
- [x] **Alpha stETH Deposits Analytics**: Complete production-ready system
- [x] **Generated Reports**: All three formats (JSON, CSV, MD) working
- [x] **Command Line Interface**: `pnpm export:alpha:*` commands available

### 🚀 NEXT - Phase 1 – Foundations (Manage View Analytics)

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

---

## 📋 Next PR Tasks - Manage View Analytics Implementation

### Priority 1: Server-Side Event Collection
- [ ] Create `/api/events` endpoint with JSON schema validation
- [ ] Implement request IP/user-agent capture and enrichment
- [ ] Add server-side wallet address hashing (sha256 with salt)
- [ ] Set up environment flags for analytics configuration

### Priority 2: Attribution & Privacy
- [ ] Implement UTM middleware for first-party cookie (`somm_attrib`)
- [ ] Add consent management for marketing pixels
- [ ] Create privacy-compliant data handling pipeline
- [ ] Set up data retention and deletion procedures

### Priority 3: Manage View Instrumentation
- [ ] Instrument wallet connect/disconnect events
- [ ] Track chain switching flows (opened/attempted/succeeded/failed)
- [ ] Add token selection and amount input tracking
- [ ] Implement approve/deposit flow analytics
- [ ] Wire error tracking to centralized handler

### Priority 4: Testing & QA
- [ ] Add Playwright e2e tests for analytics events
- [ ] Test ad-blocker resilience with server-side collection
- [ ] Verify UTM attribution persistence across routes
- [ ] Set up monitoring and alerting for event collection

### Priority 5: Dashboard & Reporting
- [ ] Create conversion funnel dashboards
- [ ] Set up error rate monitoring
- [ ] Build attribution and campaign tracking
- [ ] Implement performance correlation analytics

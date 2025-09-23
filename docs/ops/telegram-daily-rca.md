# Daily Telegram Delivery RCA

## Executive Summary

Daily Alpha stETH Telegram messages did not send because the scheduled workflow generated reports but **posting was disabled** (no `TELEGRAM_MODE=strict`, and the posting step was not invoked). The test workflow sent messages but then failed due to missing `START_BLOCK_ALPHA_STETH`, masking the healthy path.

## Timeline

- PR 1852/1854 – analytics/export code added; workflows introduced
- PR 1855 – Telegram workflows merged; daily job generated files only (no TG), test job posted a message then failed validation
- 2025‑09‑23 – RCA performed; env guardrails and sender entrypoint added

## Call Chain (Expected)

Scheduler → env-check → sender → `export-alpha-deposits.mjs --post-telegram` → Telegram API

## Failing Path (Before)

- `alpha-steth-deposits.yml` ran `generate-alpha-deposits.mjs` (no TG), committed artifacts; **no post**
- `test-telegram.yml` posted then ran `generate-alpha-deposits.mjs` **without** `START_BLOCK_ALPHA_STETH` → error, noisy logs

## ENV Audit

| Key                     | Required | Where        | Status           |
| ----------------------- | -------- | ------------ | ---------------- |
| TELEGRAM_BOT_TOKEN      | yes      | secrets      | present          |
| TELEGRAM_CHAT_ID        | yes      | secrets      | present          |
| START_BLOCK_ALPHA_STETH | yes      | secrets/vars | present          |
| UPSTASH_REST_URL        | yes      | secrets      | present          |
| UPSTASH_REST_TOKEN      | yes      | secrets      | present          |
| NODE_ENV                | yes      | runtime      | set by workflows |

## Minimal Fix

1. Add strict env schema + CLI (`scripts/env/*`) and fail early in CI
2. New daily workflow that requires env-check and runs typed sender
3. Sender reuses exporter with `--post-telegram`

## Post‑Fix Validation

- Local: `pnpm env:check` passes; `pnpm send:daily:dry` executes audit
- Manual: workflow_dispatch posts to test chat
- Scheduled: `daily-telegram.yml` runs with env-check; will fail early if any key missing/malformed

## Prevention

- Env schema enforced locally and in CI
- Sender logs UTC/Tallinn start, chat id, decisions, HTTP status

## Go Live Note

- Date: 2025-09-23
- Test chat: <add id or @handle>
- Manual runs:
  - Dry: `ENV_MODE=dry pnpm send:daily:live` (no post)
  - Live (override): `TELEGRAM_CHAT_ID=$TELEGRAM_CHAT_ID_TEST pnpm send:daily:live`
- CI manual rehearsal via workflow_dispatch: use inputs `mode=dry|live`, optional `chat_id` override
- Cron: `5 6 * * *` (UTC) → 09:05 Europe/Tallinn (currently UTC+3)
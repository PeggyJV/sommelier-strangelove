## Alpha stETH Manage – Analytics Audit

Status: Investigation only (no code changes)

### Current signals in the codebase

- Vercel Analytics is mounted in the app shell
  - File: `src/pages/_app.tsx`, renders `Analytics` from `@vercel/analytics/react`.
- Google Tag Manager (GTM) is injected in document head and noscript
  - File: `src/pages/_document.tsx` – loads `GTM-<env>` via inline script and noscript iframe.
- Custom analytics wrapper present, gated by env flags
  - File: `src/utils/analytics.ts` – wraps `analytics` with optional Mixpanel plugin and GTM `dataLayer` push. Enabled by `NEXT_PUBLIC_ANALYTICS_ENABLED=true`.
  - Mixpanel optional via `NEXT_PUBLIC_MIXPANEL_TOKEN` and optional proxy `NEXT_PUBLIC_MIXPANEL_PROXY_HOST`.
- Event usage on product flows (Manage and others)
  - Deposit/Approve flows emit analytics events (success/reject) using `analytics.track(...)`.
    - File: `src/components/_modals/DepositModal/SommelierTab.tsx` (multiple `analytics.track(...)`).
  - Wallet disconnect event: `wallet.disconnected`.
    - File: `src/components/_buttons/ConnectButton/ConnectedPopover.tsx`.
  - Various safeTrack calls on details selections.
    - File: `src/components/_cards/StrategyBreakdownCard/index.tsx`.
- Web Vitals client collector
  - File: `src/utils/webVitals.ts` – sends CLS/FCP/LCP/TTFB/INP to `/api/vitals`.
  - No `/pages/api/vitals` route is present → these POSTs will 404 unless handled upstream.
- UTM / attribution handling
  - No explicit UTM parsing or cookie persistence found in repo (grep on `utm_`, `UTM`, `campaign`, `src=`). No middleware capture.
- Server routes with possible data storage
  - `src/pages/api/saveSignedMessage.ts` uses `@vercel/kv` (unrelated to analytics; wallet mapping use-case).

### Current signals at runtime (live page)

- GTM is present and loads on `Alpha-stETH/manage`.
  - Evidence: initial HTML includes GTM snippet and noscript iframe.
- Network/Globals (manual check recommended in DevTools):
  - Expect `window.dataLayer` to exist. No evidence of Mixpanel/PostHog tags unless configured by GTM.
  - Vercel Analytics sends beacon (first-party) – resilient to many blockers but still client-side.
  - No custom `/api/vitals` observed server-side; likely 404 if enabled.

### Gaps and risks

- No UTM capture or attribution cookie – losing campaign context for downstream events.
- Client-only events subject to ad blockers if routed through known domains (GTM/Mixpanel).
- Web Vitals endpoint missing → potential noise/console errors or lost metrics.
- No consent management surfaced; GDPR/CCPA risk if a marketing tag is added via GTM.
- Schema sprawl risk: events are free-form (`analytics.track`) with no centralized type/schema.
- SSR safety: analytics wrapper guards for `window`, but GTM script is injected unconditionally (OK for SSR but consent should gate firing).

### Manage view – event surface map (selectors / files)

- Page view
  - Route: `/strategies/[id]/manage` – file: `src/components/_modals/DepositModal/index.tsx` (modal shell), page composition across strategy columns.
- Wallet connect / disconnect / address
  - Component: `src/components/_buttons/ConnectButton/*` – connect, disconnect, copy, view explorer.
- Network switch
  - Component: `src/components/_buttons/ChainButton.tsx` – open selector, switch success/failure.
- Token selection
  - Component: `src/components/_menus/ModalMenu/Menu.tsx` – token list open/select.
- Amount input / Max
  - Component: `src/components/_menus/ModalMenu/Menu.tsx` – input change, Max click.
- Approve flow
  - Component: `src/components/_modals/DepositModal/SommelierTab.tsx` – approve clicked/submitted/succeeded/rejected.
- Deposit flow
  - Component: `src/components/_modals/DepositModal/SommelierTab.tsx` – deposit clicked/submitted/succeeded/rejected.
- Tooltip and details interactions
  - Components: `CardStat`, `StrategyBreakdownCard`, etc. – info icon clicks, panel opens.
- Errors / retries
  - Centralized via `handleTransactionError` and toasts; hook into this to standardize error analytics.

Suggested selectors/refs for QA

- Wallet button: `[data-testid="wallet-button"]` (add later) or component path.
- Chain switch: `[data-testid="chain-button"]`.
- Deposit modal: inputs `[name="depositAmount"]`, token menu button, approve/deposit CTAs.

### Privacy & compliance considerations

- PII: avoid collecting ENS names unless hashed; wallet addresses are pseudonymous but may be sensitive when combined with on-chain data.
- Consent: if using GTM/Mixpanel, add explicit consent banner and respect it; fire only after opt-in.
- Storage: if capturing UTM, set first-party cookie with short TTL and no cross-site sharing; avoid localStorage for consent.

### Data flow diagrams (ASCII)

Current (inferred)

```
UI events --(analytics.track)--> analytics.js (client) --(Mixpanel if token)--> Mixpanel cloud
                                     └--(dataLayer push if GTM)--> GTM tags (various)
Vercel Web Vitals (client) --POST--> /api/vitals (missing) --X--> 404
```

Recommended (minimal resilient)

```
UI events --POST--> /api/events (Next API) --enqueue--> queue/KV (server)
                                     └--> forward to Mixpanel/GA4 via server-side
Vercel Analytics (keep)
GTM (keep or remove; if keep, fire only after consent)
UTM middleware --set--> first-party cookie for attribution
```

### Unknowns / questions

- Is `NEXT_PUBLIC_ANALYTICS_ENABLED` true in production? If yes, which plugins are active via GTM?
- Do we require consent gating today for EU/EEA traffic?
- Preference for warehouse destination (BigQuery, Snowflake) later?

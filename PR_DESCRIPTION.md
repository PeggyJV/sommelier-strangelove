## fix(alpha-apy): interactive Net APY tooltip with deep‑links, FAQ autoscroll, and style normalization (Alpha stETH only)

Base: `staging`  ·  Branch: `fix/alpha-apy-tooltip-links`  ·  PR: #1837

### Summary
Unifies the Alpha stETH Net APY UX across the app, adds interactive tooltip deep‑links to specific FAQs with reliable auto‑open + auto‑scroll behavior, normalizes tooltip visuals to the global style, fixes overflow in the vault list row, and removes Net APY from the deposit modal per request.

### Scope (Alpha stETH only)
- Vaults list row (`src/components/_vaults/StrategyRow.tsx`)
- Manage page header (`src/components/CellarStatsYield.tsx`)
- Strategy details card/FAQs (`src/components/_cards/StrategyBreakdownCard/*`)
- Deposit modal (`src/components/_modals/DepositModal/SommelierTab.tsx`)

### What changed
- Net APY tooltip → Popover with interactive links; matches Chakra Tooltip theme (bg/border/radius/shadow/font). Files:
  - `src/components/alpha/AlphaApyPopover.tsx`
- Deep‑links from tooltip to FAQs now reliably:
  - Activate the FAQs tab
  - Expand the exact item (fees or apy)
  - Auto‑scroll to bottom as a strong visual cue
  - Implemented via query/hash and resilient localStorage fallback
  - Files: `StrategyBreakdownCard/index.tsx`, `StrategyBreakdownCard/FAQAccordion.tsx`, `AlphaApyPopover.tsx`
- Overflow fixes on vaults list row: constrained popover width, enabled wrapping; prevented clipping.
- Manage header: label/value order restored per request (value on top, label+tooltip under it).
- “View breakdown” toggle hidden on Manage header; component kept for future use.
- Deposit modal: removed Alpha Net APY display to keep modal focused on deposit.

### Developer notes
- Alpha stETH condition guarded by slug only; no changes to other strategies.
- `tsconfig.json` contains `i18n/*` alias used by Alpha tooltip strings.

### QA / How to verify
1) List row (Alpha) → Tooltip opens; links work and don’t overflow.
2) Manage header (Alpha) → Tooltip identical; clicking:
   - Fees: `/strategies/Alpha-stETH/manage?tab=faqs&faq=fees&autoscroll=1#faq-fees`
   - APY: `/strategies/Alpha-stETH/manage?tab=faqs&faq=apy&autoscroll=1#faq-apy`
   → FAQs tab opens, item expands, page autoscrolls to bottom.
3) Deposit modal → No Net APY block for Alpha.
4) Non‑Alpha strategies unchanged.

### Acceptance criteria
- Alpha only shows “Net APY” label and the normalized popover.
- Deep‑links expand the correct FAQ and auto‑scroll.
- No visual regressions on other vaults; no console/type errors.

# Alpha stETH UI Audit — 2025-09-13

Summary: Alpha-only Net APY label, ≈one-decimal formatting, tooltip + inline microcopy, and inline breakdown on manage page implemented. No non-Alpha regressions observed in static checks.

## Commits today
- b5203604 feat(alpha-apy-ux-v1): formatter util, inline breakdown, unify Net APY ≈one-decimal (Alpha-only)
- 7f4bc5de refine Alpha Net APY presentation (≈, microcopy), guards
- 9fecd649 add i18n/* path alias
- 307d0441 show Net APY,label+tooltip+footnote (Alpha-only)

## Files touched today
- Components: CellarStatsYield.tsx, SommelierTab.tsx, StrategyRow.tsx, AlphaStethBreakdown.tsx
- Utils: alphaStethFormat.ts
- i18n: i18n/alphaSteth.ts
- Config: tsconfig.json (alias)

## Verification findings
- Label standardization: PASS (Alpha manage/modal/cards use Net APY; others unchanged)
- Formatting ≈one-decimal: PASS (formatter in utils; applied in Alpha components)
- Inline breakdown (manage page): PASS (stacked bar + legend + caption)
- Deposit modal APY formatting: PASS (no breakdown inside modal)
- Tooltip + microcopy: PASS (Alpha)
- Non-regression: PASS (no global label change in columns/legacy files)

## Gaps and issues
- None found in static audit. Runtime checks recommended on Preview.

## Next actions
- P0: Run manual keyboard checks on Preview; attach screenshots.
- P1: Add unit test for alphaStethFormat (optional).
- Owner: UI Eng; Branch: UI_improvements (PR #1834 → staging).

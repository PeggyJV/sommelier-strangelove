# Project review guidelines

## Security focus areas
- Validate and normalize wallet addresses (use `getAddress`), never trust user input.
- Avoid `@ts-ignore`; fix types. No silent error suppression in transactions.
- Detect and handle USER_REJECTED requests; no error overlays; show info toasts.
- Approvals: approve selected token to correct spender (teller if present, else cellar). No MAX approvals with mixed number/bigint.

## React patterns
- Never call hooks conditionally. Use `enabled` flags and top-level calls.
- Memoize derived lists; avoid in-place array mutation in `useMemo`.
- Use a single shared countdown source; avoid per-row timers.

## UX & a11y
- Use `aria-live="polite"` for changing statuses (e.g., countdown).
- Prefer `aria-labelledby` over duplicate labels.
- Use tabular numerals for monetary figures; prevent wrapping.

## Perf & CI
- Keep `lighthouserc.js` assertions for INP/LCP/TBT sane; store reports.
- Avoid unnecessary rerenders by stable keys from libraries; no index keys.

## Common issues to flag
- Conditional `useUserStrategyData`/`useTable` calls.
- Wrong ERC-20 allowance owner/spender pairing.
- BigInt/number mixing in wei math and approvals.
- Defaulting decimals to 0 in `parseUnits`.

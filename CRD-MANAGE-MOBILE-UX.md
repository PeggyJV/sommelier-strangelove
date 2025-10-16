## Mobile UX improvements for `/[vault]/manage` (focus: Alpha STETH)

Goals

- Reduce friction for first‑time and repeat users on mobile
- Keep primary actions visible; compress non‑critical info
- Defer heavy UI until intent is shown

Scope (MVP)

1. Sticky Mobile Action Bar

   - Persistent at bottom; contains Connect/Deposit/Withdraw
   - Auto hides when a modal is open

2. Compact Mobile Header

   - Breadcrumb + title + chain chip in one row
   - KPIs row (TVL, Net APY/Rewards) directly under title
   - Alpha STETH: ensure "Net APY" label consistency

3. Reorder Sections (mobile)

   - KPIs → Your Portfolio → Action Bar → Performance → Details

4. Lazy‑mount Charts/Heavy Sections

   - Use Intersection Observer to render APY/TokenPrice charts on view

5. Cellar Details → Accordions

   - About, Protocols, Fees
   - Protocols: horizontal scroll chips on mobile; full list on tap

6. Deposit Modal Enhancements
   - Quick amounts ( $100 / $500 / Max )
   - Safe Max reserves gas; persist last token/amount in session
   - If wrong chain: show single "Switch to Ethereum" CTA

Non‑Goals

- Desktop redesign
- Data/metrics changes

Risks & Mitigations

- Sticky bar overlapping toasts → reserve bottom padding on page, move toasts top-right
- Chart lazy load FOUC → fade‑in placeholder skeleton

Acceptance

- No overlap/clipping at 360–430px widths
- TTI unchanged or improved; charts render on demand
- A11y: 44px touch targets, focus outlines, keyboard reachability

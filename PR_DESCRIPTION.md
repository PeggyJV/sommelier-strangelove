# Chore/cr fixes pack1

Fixes #<ISSUE_NUMBER>

## Description

This PR implements CodeRabbit AI fixes to address runtime errors, improve user experience, and modernize the codebase architecture. The changes focus on wallet connectivity, UI components, API resilience, and performance optimizations.

## Changes

### WalletConnect/AppKit Modernization

- Client-only wagmi connectors to prevent ESM/CJS conflicts
- Isolated WalletConnect initialization with proper error handling
- One-time init guard to prevent "WalletConnect Core is already initialized" errors

### Wagmi v2 Migration

- Removed all `wagmiConfig` imports in favor of client-only approach
- Migrated to provider-backed hooks (`usePublicClient`, `useWriteContract`, `useWaitForTransactionReceipt`)
- Updated contract interactions across multiple components

### Wrong-chain UX Improvements

- Added inline network switcher to action CTAs (Withdraw, Deposit)
- Implemented action flow continuation after chain switch
- Users can now switch networks without losing their intended action context

### Countdown & Availability Enhancements

- Centralized launch date from `alphaSteth.launchDate`
- Added accessibility timer with `aria-live` and `role="timer"`
- Implemented tabular-nums for consistent number alignment
- Prevented label wrapping at 320–375px breakpoints
- Removed duplicate "Available in X days" text

### API Resilience

- CoinGecko returns 200 with `{ price: null }` instead of 500 for unknown token IDs
- Strategy data returns `status: "data_pending"` for missing hourly data
- Added comprehensive error handling and graceful degradation

### Sorting Logic

- Connected wallet: Net Value desc → TVL desc → Name asc
- Disconnected wallet: TVL desc → Name asc
- Implemented stable sorting with proper tie-breaking

### Withdraw Queue Simplification

- Removed presets/discount UI for cleaner interface
- Shows "Withdrawal deadline: 14 days (fixed)" as read-only field
- Always passes 288h (14 days) in withdrawal transactions

### Contract Safety

- Added optional signer guards for disconnected wallet handling
- Implemented safe preview branching for contract interactions
- Added null checks for `formatUnits` and `toUpperCase` calls

### UI Polish & Accessibility

- Added visible focus rings across all interactive components
- Ensured AA contrast compliance for accessibility
- Implemented full keyboard navigation for popovers and tooltips
- Created consistent metric display with `KPIBox` component
- Optimized re-renders and memoized heavy computations

### Tooling & Development

- Added TypeScript shims for problematic `ox` library
- Configured ESLint v8 scoped lint for edited surfaces only
- Resolved ox library conflicts with `skipLibCheck` approach

### Runtime Error Fixes

- Fixed `formatUnits` errors by adding null checks in `useUserBalances.ts`
- Fixed `toUpperCase` errors by adding guards in `PageHome.tsx`
- Application continues to function even with missing data

## Testing Steps

### Wallet Connectivity Testing

- [ ] Connect wallet and verify no ESM/CJS errors
- [ ] Test inline network switcher on action buttons
- [ ] Confirm actions resume properly after network switches
- [ ] Test deposit, withdraw, and migration transactions

### Countdown & Banner Testing

- [ ] Verify countdown displays correctly without wrapping at 320-375px
- [ ] Test with screen reader to confirm aria-live announcements
- [ ] Check countdown layout on mobile devices
- [ ] Confirm no redundant "Available in X days" messages

### Withdraw Queue Testing

- [ ] Verify withdraw form shows "14 days (fixed)" as read-only
- [ ] Confirm withdrawal transactions use 288h deadline
- [ ] Check that presets/discount UI has been removed

### Sorting & Data Testing

- [ ] With wallet connected, verify vaults sort by Net Value → TVL → Name
- [ ] Without wallet, verify vaults sort by TVL → Name
- [ ] Confirm sorting is stable and consistent

### Error Handling Testing

- [ ] Test with invalid CoinGecko tokens (should return 200 with null price)
- [ ] Test with missing strategy hourly data (should return "data_pending")
- [ ] Verify no crashes when encountering undefined values

### UI/UX Testing

- [ ] Tab through interface to verify visible focus indicators
- [ ] Test all interactive elements with keyboard only
- [ ] Verify AA contrast compliance for text elements
- [ ] Check for improved loading times and reduced re-renders

### Development Testing

- [ ] Run `pnpm run build` to verify successful compilation
- [ ] Run `pnpm run typecheck:scoped` to verify no type errors
- [ ] Run `pnpm run lint:scoped` to verify code quality
- [ ] Test development server hot reload functionality

## Technical Notes

### Breaking Changes

- None - all changes are backward compatible

### Performance Impact

- Reduced bundle size through client-only imports
- Better error handling prevents unnecessary re-renders
- Memoized sorting logic reduces computation overhead

### Security Considerations

- Better input validation and null checks
- Safer contract interactions with proper error handling
- Improved wallet connection security with one-time init guards

### Dependencies

- Updated: Wagmi v2 migration completed
- Updated: WalletConnect to latest stable version
- Added: TypeScript shims for ox library compatibility

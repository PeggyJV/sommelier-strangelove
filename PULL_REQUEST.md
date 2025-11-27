# Somm Refresh: Vault Manager UI/UX Update (Draft)

## 📋 Summary

This PR implements a comprehensive UI/UX refresh for the Sommelier app (sommelier-strangelove), applying the same design tokens and visual direction as somm.finance. The update includes refreshed vault pages, updated components, and new semantic tokens to align with the Vault Manager positioning.

## 🎯 What's Changed

### Design Tokens
- **`src/theme/somm-theme.json`** - Unified design tokens (same as sommelier-website):
  - Colors: Primary (#2434FF), Secondary (#6A57E8), Background (#0D0F14), Surface (#1A1D25)
  - Typography: Inter font family
  - Spacing, radii, and shadows

### Theme Configuration
- **`src/theme/index.ts`** - Updated semantic tokens and theme config
- **`src/theme/colors.ts`** - New brand color mappings
- **`src/theme/fonts.ts`** - Inter font + fontWeights/fontSizes exports
- **`src/theme/styles.ts`** - Global styles using new tokens
- **`src/theme/GlobalFonts.tsx`** - Added Inter from Google Fonts

### Vault Pages
- **`app/vaults/page.tsx`** - Refreshed page header with new styling
- **`app/vaults/NewVaultsList.tsx`** - Redesigned vault cards with hover states
- **`src/components/_vaults/LegacyVaultCard.tsx`** - Updated with new tokens
- **`src/components/_vaults/StrategyRow.tsx`** - Updated with new tokens
- **`src/components/_vaults/ExecutionLogicOverview.tsx`** - **NEW** component explaining vault manager role

### Core Components
- **`src/components/_buttons/BaseButton.tsx`** - Primary button with new colors
- **`src/components/_buttons/SecondaryButton.tsx`** - Outline button style
- **`src/components/ui/ActionButton.tsx`** - All variants updated
- **`src/components/_cards/Card.tsx`** - Surface background + border
- **`src/components/_cards/CardBase.tsx`** - Updated styling
- **`src/components/_layout/Layout.tsx`** - New background color
- **`src/components/Nav.tsx`** - Updated navigation colors
- **`src/components/_modals/BaseModal.tsx`** - Updated modal styling

### UI Consistency Fixes
- **`src/components/_skeleton/index.tsx`** - New skeleton colors
- **`src/components/_layout/CardDivider.tsx`** - Updated border color
- **`src/components/_charts/LineToolTip.tsx`** - Updated tooltip
- **`src/components/_charts/BarToolTip.tsx`** - Updated tooltip
- **`src/components/Strategy/Carousel/Badge.tsx`** - New badge colors
- Various filter components - Font family fixes

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `src/theme/somm-theme.json` | Design token source of truth |
| `src/theme/index.ts` | Chakra theme configuration |
| `src/components/_vaults/ExecutionLogicOverview.tsx` | Vault Manager explanation |

## ✅ Done

- [x] Add design tokens (somm-theme.json)
- [x] Update theme colors, fonts, semantic tokens
- [x] Update core button components
- [x] Update card components
- [x] Update layout and navigation
- [x] Refresh vault list page
- [x] Add ExecutionLogicOverview component
- [x] Fix Haffer → Inter font references
- [x] Update visible modal/banner components
- [x] Lint passes with no new errors

## 🚧 Still Pending

- [ ] Update remaining ~100 components with old purple.base/purple.dark references
- [ ] Update all gradient.primary references
- [ ] Mobile responsiveness testing
- [ ] Visual regression testing
- [ ] Connect vault data to ExecutionLogicOverview
- [ ] Add vault-specific execution rules
- [ ] Performance testing

## 🧪 Local Testing

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Build for production
pnpm build
```

## 📸 Screenshots

> Add screenshots of updated vault pages here

## 🏷️ Labels

`ui-refresh`, `design-tokens`, `vault-manager`, `draft`

## 👤 Assignee

@henrio123

---

**Note:** This is a DRAFT PR. Please review and provide feedback before merging.

## 📝 TODO

The following components still have legacy color references and should be updated in follow-up PRs:

### High Priority
- [ ] `_modals/DepositModal/*` - Deposit flow modals
- [ ] `_modals/WithdrawModal/*` - Withdraw flow modals
- [ ] `_forms/*` - Form components
- [ ] `_buttons/ConnectButton/*` - Wallet connection

### Medium Priority
- [ ] `_cards/ApyPerformanceCard.tsx`
- [ ] `_cards/TokenPricePerformanceCard.tsx`
- [ ] `_cards/StrategyBreakdownCard/*`
- [ ] `_tables/StrategyTable.tsx`
- [ ] `_columns/*` - Strategy columns

### Lower Priority
- [ ] `_charts/*` - Chart components
- [ ] `alpha/*` - Alpha-specific components
- [ ] Remaining tooltip/popover components


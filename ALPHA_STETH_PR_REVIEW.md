# Alpha stETH Deposit Flow - PR Review Checklist

## 🔴 Critical Path - Review First

- [ ] **`src/data/strategies/alpha-steth.ts`**
  - [ ] Vault configuration correct
  - [ ] Launch date consistent (August 19, 2025)
  - [ ] Fee structure (1.00% management fee)
  - [ ] Multi-asset deposit tokens: WETH, stETH, wstETH, ETH
  - [ ] Performance split: 80%/15%/5%
  - [ ] Protocol integrations: Lido, EigenLayer, Morpho, Euler, AAVE, Uniswap V3, Balancer, Mellow, Unichain
  - [ ] Withdraw token configurations (stETH/wstETH discount ranges)

- [ ] **`src/utils/config.ts`**
  - [ ] BoringVault contract addresses valid (lines ~346-366)
  - [ ] All required ABI imports present (lines 10-14)
  - [ ] ALPHA_STETH contract configuration complete
  - [ ] Accountant, Teller, BoringQueue, Lens addresses set
  - [ ] Contract configuration complete

- [ ] **`src/data/hooks/useCreateContracts.tsx`**
  - [ ] Teller vs Cellar routing logic secure (lines ~25-44)
  - [ ] BoringVault conditional handling (`if (config.teller)`)
  - [ ] Contract instance creation safety
  - [ ] Wallet client integration for Teller contracts

## 🟡 Core Deposit Flow - Review Second

- [ ] **`src/components/_modals/DepositModal/SommelierTab.tsx`**
  - [ ] Multi-asset handling logic (lines ~90-98)
  - [ ] Base asset (WETH) prioritization in token list
  - [ ] Deposit token filtering/ordering
  - [ ] BoringVault routing through Teller contracts
  - [ ] Error handling for multi-asset deposits

- [ ] **`src/data/uiConfig.ts`**
  - [ ] All ALPHA_STETH conditionals present throughout file
  - [ ] Deposit asset default = "WETH" (line ~42-44)
  - [ ] Withdraw queue enabled (`isWithdrawQueueEnabled`)
  - [ ] Launch date configurations (line ~394)
  - [ ] APY display logic includes ALPHA_STETH
  - [ ] Bonding period disabled for ALPHA_STETH

- [ ] **`src/components/_buttons/DepositAndWithdrawButton.tsx`**
  - [ ] Launch date validation logic
  - [ ] Contract readiness checks
  - [ ] Button state logic for before/after launch
  - [ ] Deposit/withdraw button enablement

## 🟢 Supporting Features - Review Third

- [ ] **`src/components/_sections/TopLaunchBanner.tsx`**
  - [ ] Countdown timer accuracy for launch date
  - [ ] Lido branding/images (`/assets/images/eth-lido-uni.svg`)
  - [ ] Responsive design and accessibility
  - [ ] Banner content and messaging

- [ ] **`src/data/hooks/useBoringQueueWithdrawals.ts`**
  - [ ] API query structure for withdraw requests
  - [ ] Error handling and loading states
  - [ ] Type safety with BoringQueueWithdrawals interface
  - [ ] Proper React Query integration

- [ ] **`src/data/hooks/useWithdrawRequestStatus.ts`**
  - [ ] BoringVault withdraw status tracking
  - [ ] 14-day withdrawal period handling
  - [ ] Queue position and completion logic

## 🔵 Integration Points - Spot Check

- [ ] **`src/data/cellarDataMap.ts`**
  - [ ] Alpha stETH registered correctly (line ~81)
  - [ ] Strategy import present (line ~40)
  - [ ] Address mapping includes ALPHA_STETH

- [ ] **`src/data/strategies/index.ts`**
  - [ ] Alpha stETH export added (line ~37)

- [ ] **ABI Types**: `src/abi/types/BoringVault/`
  - [ ] `BoringVault.ts` - Main vault contract types
  - [ ] `AccountantWithRateProviders.ts` - Rate provider types
  - [ ] `TellerWithLayerZero.ts` - Deposit/withdraw types
  - [ ] `BoringOnChainQueue.ts` - Queue management types
  - [ ] `ArcticArchitectureLens.ts` - View function types

- [ ] **Asset Icons**
  - [ ] `/public/assets/icons/alpha-steth.png` exists
  - [ ] `/public/assets/images/eth-lido-uni.svg` exists

## Final Validation

- [ ] **Consistency Checks**
  - [ ] Launch dates consistent across all files (2025-08-19T00:00:00Z)
  - [ ] Contract addresses match across config and strategy files
  - [ ] ALPHA_STETH enum value used consistently

- [ ] **Multi-Asset Deposit Logic**
  - [ ] WETH, stETH, wstETH, ETH all supported
  - [ ] Base asset (WETH) appears first in deposit token list
  - [ ] Asset filtering excludes base asset then re-adds at top

- [ ] **Withdraw Queue Configuration**
  - [ ] Discount configs: stETH (1-10%), wstETH (2-10%)
  - [ ] Minimum seconds to deadline: 259200 (3 days)
  - [ ] Minimum shares: 0

- [ ] **BoringVault Architecture**
  - [ ] Teller contract used for deposits instead of direct vault
  - [ ] Proper contract routing in useCreateContracts
  - [ ] All required contract addresses configured

- [ ] **UI/UX Integration**
  - [ ] Launch banner displays before August 19, 2025
  - [ ] Deposit buttons disabled before launch
  - [ ] Withdraw queue UI functional
  - [ ] Error states handled gracefully

- [ ] **Development Testing**
  - [ ] No console errors in dev mode
  - [ ] Deposit flow works end-to-end (after launch date)
  - [ ] Multi-asset selection functions properly
  - [ ] Withdraw queue requests can be created

## Notes
- This is a BoringVault architecture (different from traditional Cellar contracts)
- Uses Teller contracts for deposits instead of direct vault interaction
- Multi-asset support is a key feature
- Launch date is in the future with countdown functionality
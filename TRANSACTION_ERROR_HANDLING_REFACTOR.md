# Transaction Error Handling Refactor

## Summary

Implemented centralized, consistent error-handling pattern for all user-initiated transaction rejections across vault modals.

## Root Cause

- **Problem**: Duplicate error handling code scattered across components
- **Inconsistencies**: Different toast messages, analytics tracking, and error detection patterns
- **Maintenance**: Hard to update error handling logic across multiple files

## Improvements

### 1. Centralized Error Detection

- **New utility**: `src/utils/handleTransactionError.ts`
- **Consistent detection**: Handles all user rejection patterns:
  - `error.code === 4001` (EIP-1193)
  - `error.message.includes("User rejected")`
  - `error.message.includes("User denied")`
  - `error.message.includes("MetaMask Tx Signature: User denied")`

### 2. Normalized Error Types

```typescript
type TransactionErrorType =
  | "USER_REJECTED"
  | "GAS_LIMIT_ERROR"
  | "SPAM_FILTER_ERROR"
  | "OTHER"
```

### 3. Consistent Analytics

- **Standardized tracking**: All rejections tracked with consistent data structure
- **Required fields**: vaultName, tokenSymbol, transactionType, value, chainId
- **Event naming**: `{action}.rejected` (e.g., `deposit.rejected`, `withdraw.rejected`)

### 4. Unified UI Messages

- **Consistent headings**: `"{VaultName} {Action}"`
- **Popup guidance**: Added when user rejection detected
- **Standardized status**: info for user rejections, warning for spam filter, error for others

## Files Modified

### 1. New Utility

- `src/utils/handleTransactionError.ts` - Centralized error handling logic

### 2. Updated Components

- `src/components/_modals/DepositModal/SommelierTab.tsx` - Deposit and approval error handling
- `src/components/_forms/WithdrawForm.tsx` - Withdraw error handling

## Code Changes

### Before (SommelierTab.tsx)

```typescript
} else if (
  error.message.includes("User rejected") ||
  error.message.includes("User denied")
) {
  analytics.track("deposit.rejected", {
    ...baseAnalytics,
    stable: tokenSymbol,
    value: depositAmount,
    message: "USER_REJECTED",
  })
  addToast({
    heading: cellarName + " Deposit",
    body: <Text>Deposit Cancelled - Transaction was rejected</Text>,
    status: "info",
    closeHandler: closeAll,
  })
}
```

### After (SommelierTab.tsx)

```typescript
// Use centralized error handling
const errorContext: TransactionErrorContext = {
  vaultName: cellarName,
  tokenSymbol,
  transactionType: "deposit",
  value: depositAmount,
  chainId: cellarConfig.chain.id,
}

const normalizedError = handleTransactionError(error, errorContext)
const toastConfig = getTransactionErrorToast(
  normalizedError,
  errorContext
)
const analyticsData = getTransactionErrorAnalytics(
  normalizedError,
  errorContext
)

// Track analytics
analytics.track("deposit.rejected", {
  ...baseAnalytics,
  ...analyticsData,
})

// Show toast with popup guidance if needed
const toastBody = toastConfig.showPopupGuidance ? (
  <Text>
    {toastConfig.body}
    <br />
    Enable popups for MetaMask and retry.
  </Text>
) : (
  <Text>{toastConfig.body}</Text>
)

addToast({
  heading: toastConfig.heading,
  body: toastBody,
  status: toastConfig.status,
  closeHandler: closeAll,
})
```

## QA Checklist

### Deposit Flow Testing

- [ ] **User rejects deposit transaction**

  - [ ] Shows toast: "{VaultName} Deposit - Transaction was rejected"
  - [ ] Includes popup guidance: "Enable popups for MetaMask and retry"
  - [ ] Analytics tracked: `deposit.rejected` with correct data
  - [ ] Loading states reset properly

- [ ] **User rejects approval transaction**

  - [ ] Shows toast: "{VaultName} Approval - Transaction was rejected"
  - [ ] Includes popup guidance
  - [ ] Analytics tracked: `approval.rejected`
  - [ ] Form remains in valid state for retry

- [ ] **Spam filter blocks transaction**
  - [ ] Shows warning toast with spam filter guidance
  - [ ] Analytics tracked: `deposit.rejected` with `SPAM_FILTER_ERROR`

### Withdraw Flow Testing

- [ ] **User rejects withdraw transaction**

  - [ ] Shows toast: "{VaultName} Withdraw - Transaction was rejected"
  - [ ] Includes popup guidance
  - [ ] Analytics tracked: `withdraw.rejected`
  - [ ] Form resets properly

- [ ] **Gas limit error**
  - [ ] Shows appropriate error message
  - [ ] Analytics tracked correctly

### Cross-Vault Consistency

- [ ] **All vaults show consistent error messages**
- [ ] **All vaults track analytics consistently**
- [ ] **All vaults include popup guidance for user rejections**

### Error Detection

- [ ] **EIP-1193 code 4001** - Detected as user rejection
- [ ] **"User rejected the request"** - Detected as user rejection
- [ ] **"User denied transaction"** - Detected as user rejection
- [ ] **"MetaMask Tx Signature: User denied"** - Detected as user rejection

### Browser/Environment Testing

- [ ] **MetaMask popup blocked** - Shows guidance to enable popups
- [ ] **Different browsers** - Error handling works consistently
- [ ] **Mobile wallets** - Error messages appropriate for mobile context

## Next Steps

### Remaining Components to Update

- [ ] `src/components/_forms/BondForm/index.tsx`
- [ ] `src/components/_forms/WithdrawQueueForm.tsx`
- [ ] `src/components/_cards/PortfolioCard/Rewards.tsx`
- [ ] `src/hooks/web3/useBridgeEthToSommTx.tsx`
- [ ] `src/hooks/web3/useBridgeSommToEthTx.tsx`
- [ ] `src/components/_cards/PortfolioCard/MerklePoints/MerklePoints.tsx`

### Future Enhancements

- [ ] **Centralized toast messages** - Move all toast strings to constants
- [ ] **Error recovery suggestions** - Context-specific guidance
- [ ] **Retry mechanisms** - Automatic retry for certain error types
- [ ] **Error reporting** - Send error data to monitoring service

## Benefits Achieved

1. **Consistency**: All vaults now handle errors identically
2. **Maintainability**: Single source of truth for error handling logic
3. **User Experience**: Consistent messaging and guidance across all flows
4. **Analytics**: Standardized tracking for better insights
5. **Type Safety**: Full TypeScript support with strict typing

# Priority 3: Manage View Instrumentation

## Overview

This document outlines the implementation of Priority 3: Manage View Instrumentation for the analytics system. This phase adds comprehensive tracking for all user interactions within the Manage view, including wallet connections, token selection, amount input, transaction flows, and error handling.

## ✅ **Implemented Features**

### **Wallet & Chain Analytics**

#### **Wallet Connection Tracking**
- **✅ Wallet connect/disconnect events**: Complete tracking of wallet connection lifecycle
- **✅ Enhanced connect function**: `connectWithAnalytics` with automatic event tracking
- **✅ Enhanced disconnect function**: `disconnectWithAnalytics` with cleanup tracking
- **✅ Connection failure tracking**: Error tracking for failed connection attempts
- **✅ Modal interactions**: Wallet connection modal open/close tracking

#### **Chain Switching Analytics**
- **✅ Chain switch attempts**: Track when users attempt to switch chains
- **✅ Chain switch success**: Track successful chain switches with timing
- **✅ Chain switch failures**: Track failed chain switches with error details
- **✅ Enhanced switch function**: `switchChainWithAnalytics` with comprehensive tracking
- **✅ Chain switch timing**: Duration tracking for chain switch operations

### **Token Input Analytics**

#### **Token Selection Tracking**
- **✅ Token selection events**: Track when users select different tokens
- **✅ Token modal interactions**: Modal open/close and category selection tracking
- **✅ Token search tracking**: Search query analysis and results count
- **✅ Previous token tracking**: Track token switching patterns

#### **Amount Input Tracking**
- **✅ Amount changes**: Debounced tracking of amount input changes
- **✅ Input focus/blur**: Track user interaction with amount fields
- **✅ Max button clicks**: Track when users click max amount buttons
- **✅ Clear button clicks**: Track when users clear amount inputs
- **✅ Amount validation**: Track validation results and error types

#### **Balance & Validation Tracking**
- **✅ Balance checks**: Track balance verification and sufficiency
- **✅ Amount validation**: Track validation results (valid, insufficient, invalid format, etc.)
- **✅ Input type tracking**: Track manual vs. max vs. clear input types
- **✅ Decimal place tracking**: Track precision of amount inputs

### **Transaction Flow Analytics**

#### **Approve Flow Tracking**
- **✅ Approve button clicks**: Track when users click approve buttons
- **✅ Approve transaction submission**: Track transaction submission with hash
- **✅ Approve success tracking**: Track successful approvals with gas usage
- **✅ Approve failure tracking**: Track failed approvals with error details
- **✅ Approve timing**: Duration tracking for approve operations

#### **Deposit Flow Tracking**
- **✅ Deposit button clicks**: Track when users click deposit buttons
- **✅ Deposit transaction submission**: Track deposit submission with hash
- **✅ Deposit success tracking**: Track successful deposits with gas usage
- **✅ Deposit failure tracking**: Track failed deposits with error details
- **✅ Deposit timing**: Duration tracking for deposit operations

#### **Transaction Lifecycle Tracking**
- **✅ Transaction retries**: Track retry attempts and reasons
- **✅ Transaction cancellation**: Track when users cancel transactions
- **✅ Transaction timeouts**: Track timeout events and durations
- **✅ Gas estimation**: Track gas estimation results and costs
- **✅ Transaction confirmation**: Track confirmation counts and timing

### **Error Tracking System**

#### **Centralized Error Tracking**
- **✅ User error tracking**: Track user action errors (insufficient balance, invalid input, etc.)
- **✅ System error tracking**: Track system errors (API errors, RPC errors, etc.)
- **✅ Network error tracking**: Track network issues (timeouts, connection failures, etc.)
- **✅ Validation error tracking**: Track validation failures and error types
- **✅ Generic error tracking**: Comprehensive error tracking with context

#### **Error Lifecycle Management**
- **✅ Error recovery tracking**: Track recovery attempts and actions
- **✅ Error dismissal tracking**: Track how users dismiss errors
- **✅ Error reporting**: Track error reports and debug information
- **✅ Error pattern detection**: Track repeated errors and error cascades
- **✅ Performance error tracking**: Track performance-related errors

### **UI Interaction Analytics**

#### **Tooltip & Modal Tracking**
- **✅ Tooltip interactions**: Track tooltip open/close with triggers
- **✅ Modal interactions**: Track modal open/close with reasons
- **✅ Button interactions**: Track button clicks with types and context
- **✅ Navigation tracking**: Track page navigation and methods

#### **UI Component Tracking**
- **✅ Accordion interactions**: Track accordion toggle events
- **✅ Tab switching**: Track tab group interactions
- **✅ Dropdown interactions**: Track dropdown open/close events
- **✅ Copy to clipboard**: Track clipboard copy actions
- **✅ Scroll tracking**: Track scroll direction and position

#### **Focus & Input Tracking**
- **✅ Element focus/blur**: Track focus interactions with elements
- **✅ Viewport changes**: Track viewport size changes and device types
- **✅ Page interactions**: Track page-specific interactions
- **✅ Section views**: Track when users view specific page sections

## 📁 **Files Added**

### **Analytics Hooks**
- `src/hooks/useAnalyticsWallet.ts` - Wallet and chain switching analytics
- `src/hooks/useAnalyticsTokenInput.ts` - Token selection and amount input analytics
- `src/hooks/useAnalyticsTransaction.ts` - Transaction flow analytics
- `src/hooks/useAnalyticsError.ts` - Centralized error tracking
- `src/hooks/useAnalyticsUI.ts` - UI interaction analytics

### **Analytics Provider**
- `src/components/analytics/AnalyticsProvider.tsx` - Centralized analytics provider
- `src/components/analytics/ExampleAnalyticsIntegration.tsx` - Integration examples

### **Documentation & Testing**
- `docs/analytics/priority-3-manage-view-instrumentation.md` - This implementation guide
- `src/__tests__/analytics-hooks.test.tsx` - Comprehensive test suite

## 🔧 **Environment Variables**

### **Required**
```bash
# Enable analytics (same as previous priorities)
NEXT_PUBLIC_ANALYTICS_ENABLED=true
EVENTS_SALT=your-secure-salt-here
```

### **Optional Analytics Configuration**
```bash
# Analytics feature flags
ANALYTICS_TRACK_WALLET_EVENTS=true
ANALYTICS_TRACK_TOKEN_EVENTS=true
ANALYTICS_TRACK_TRANSACTION_EVENTS=true
ANALYTICS_TRACK_ERROR_EVENTS=true
ANALYTICS_TRACK_UI_EVENTS=true

# Debouncing configuration
ANALYTICS_AMOUNT_DEBOUNCE_MS=1000
ANALYTICS_INPUT_DEBOUNCE_MS=500
```

## 🎯 **Analytics Events Tracked**

### **Wallet & Chain Events**
- `wallet_connected` / `wallet_disconnected`
- `chain_switch_attempted` / `chain_switch_succeeded` / `chain_switch_failed`
- `wallet_modal_opened` / `wallet_modal_closed`
- `wallet_connector_selected`

### **Token & Input Events**
- `token_selected` / `token_search`
- `amount_changed` / `input_focused` / `input_blurred`
- `max_button_clicked` / `clear_button_clicked`
- `balance_checked` / `amount_validated`
- `token_modal_opened` / `token_modal_closed`

### **Transaction Events**
- `approve_clicked` / `approve_submitted` / `approve_succeeded` / `approve_rejected`
- `deposit_clicked` / `deposit_submitted` / `deposit_succeeded` / `deposit_rejected`
- `transaction_retry` / `transaction_cancelled` / `transaction_timeout`
- `gas_estimated` / `transaction_confirmed`

### **Error Events**
- `error_shown` (with categories: user_error, system_error, network_error, validation_error)
- `error_recovery` / `error_dismissed` / `error_reported`
- `error_pattern_detected` / `performance_error`

### **UI Events**
- `tooltip_opened` / `tooltip_closed`
- `modal_opened` / `modal_closed`
- `button_clicked` / `navigation`
- `accordion_toggled` / `tab_switched` / `dropdown_opened`
- `copy_to_clipboard` / `scroll` / `viewport_changed`

## 🔒 **Privacy & Security**

- **No PII collection**: Only hashed wallet addresses and anonymous session data
- **Debounced tracking**: Amount input changes are debounced to prevent excessive tracking
- **Error sanitization**: Error messages are sanitized before tracking
- **Context-aware tracking**: Only relevant context is included in events
- **User control**: Analytics can be disabled per category or globally

## 🧪 **Testing**

### **Test Coverage**
- **Integration tests**: Complete analytics provider integration testing
- **Hook testing**: Individual analytics hook functionality testing
- **Error handling**: Analytics error handling and graceful degradation
- **Mock testing**: Comprehensive mocking of external dependencies
- **Context testing**: Analytics context provider and hook usage testing

### **Test Categories**
- **Unit tests**: Individual hook and utility function testing
- **Integration tests**: Provider and hook integration testing
- **Error tests**: Error handling and recovery testing
- **Mock tests**: External dependency mocking and testing

## 📈 **Usage Examples**

### **Basic Analytics Provider Setup**
```typescript
import { AnalyticsProvider } from '@/components/analytics/AnalyticsProvider'

function App({ children }) {
  return (
    <AnalyticsProvider
      enabled={true}
      trackWalletEvents={true}
      trackTokenEvents={true}
      trackTransactionEvents={true}
      trackErrorEvents={true}
      trackUIEvents={true}
    >
      {children}
    </AnalyticsProvider>
  )
}
```

### **Wallet Analytics Integration**
```typescript
import { useAnalyticsWallet } from '@/components/analytics/AnalyticsProvider'

function WalletButton() {
  const { connectWithAnalytics, disconnectWithAnalytics } = useAnalyticsWallet()

  return (
    <div>
      <button onClick={() => connectWithAnalytics('metaMask')}>
        Connect Wallet
      </button>
      <button onClick={disconnectWithAnalytics}>
        Disconnect
      </button>
    </div>
  )
}
```

### **Token Input Analytics Integration**
```typescript
import { useAnalyticsTokenInput } from '@/components/analytics/AnalyticsProvider'

function TokenInput() {
  const { trackTokenSelection, trackAmountChange } = useAnalyticsTokenInput()

  const handleTokenChange = (token) => {
    trackTokenSelection(token.symbol, token.address, previousToken)
  }

  const handleAmountChange = (amount) => {
    trackAmountChange(amount, selectedToken.symbol, 'manual')
  }

  return (
    <div>
      <TokenSelector onChange={handleTokenChange} />
      <AmountInput onChange={handleAmountChange} />
    </div>
  )
}
```

### **Transaction Analytics Integration**
```typescript
import { useAnalyticsTransaction } from '@/components/analytics/AnalyticsProvider'

function DepositButton() {
  const { trackDepositClick, trackDepositSuccess, trackDepositFailure } = useAnalyticsTransaction()

  const handleDeposit = async () => {
    try {
      await trackDepositClick(tokenSymbol, amount, strategyId)
      const result = await deposit(tokenSymbol, amount)
      await trackDepositSuccess(tokenSymbol, amount, strategyId, result.txHash)
    } catch (error) {
      await trackDepositFailure(tokenSymbol, amount, strategyId, error)
    }
  }

  return <button onClick={handleDeposit}>Deposit</button>
}
```

### **Error Analytics Integration**
```typescript
import { useAnalyticsError } from '@/components/analytics/AnalyticsProvider'

function ErrorHandler() {
  const { trackUserError, trackSystemError } = useAnalyticsError()

  const handleUserError = (error) => {
    trackUserError('insufficient_balance', error.message, {
      token: 'USDC',
      amount: '1000',
    })
  }

  const handleSystemError = (error) => {
    trackSystemError('api_error', error.message, {
      endpoint: '/api/deposits',
      status: error.status,
    })
  }

  return <div>Error handling component</div>
}
```

### **UI Analytics Integration**
```typescript
import { useAnalyticsUI } from '@/components/analytics/AnalyticsProvider'

function InteractiveComponent() {
  const { trackTooltipOpen, trackButtonClick, trackCopyToClipboard } = useAnalyticsUI()

  return (
    <div>
      <button
        onClick={() => trackButtonClick('deposit-button', 'primary')}
        onMouseEnter={() => trackTooltipOpen('deposit-tooltip', 'hover')}
      >
        Deposit
      </button>
      <button
        onClick={() => trackCopyToClipboard('0x123...', 'address')}
      >
        Copy Address
      </button>
    </div>
  )
}
```

## 🚀 **Next Steps**

This implementation completes **Priority 3** of the analytics roadmap. Next PRs will implement:

- **Priority 4**: Testing & QA setup
- **Priority 5**: Dashboard & reporting

## 📋 **Related PRs**

- **[PR #1851](https://github.com/PeggyJV/sommelier-strangelove/pull/1851)** - Project plan and roadmap (DRAFT)
- **[PR #1854](https://github.com/PeggyJV/sommelier-strangelove/pull/1854)** - Alpha stETH deposits analytics (MERGED)
- **[PR #1856](https://github.com/PeggyJV/sommelier-strangelove/pull/1856)** - Priority 1: Server-side event collection (OPEN)
- **[PR #1857](https://github.com/PeggyJV/sommelier-strangelove/pull/1857)** - Priority 2: Attribution & Privacy (OPEN)

## 🔍 **Ready for Review**

This implementation provides comprehensive Manage view instrumentation with detailed tracking of all user interactions. The system is designed to be privacy-compliant, performant, and easily integrable into existing components. The analytics hooks provide a clean interface for tracking events while maintaining separation of concerns.

**Estimated effort**: 2-3 days (Priority 3 complete)
**Next phase**: Priority 4 - Testing & QA setup

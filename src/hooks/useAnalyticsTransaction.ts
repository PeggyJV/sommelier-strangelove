/*
  Analytics hook for transaction flow tracking (approve/deposit)
  Tracks user interactions with transaction buttons and flow progression
*/

import { useCallback, useEffect, useRef } from 'react'
import { serverAnalytics } from '../utils/analytics-server'

interface TransactionAnalyticsProps {
  enabled?: boolean
  trackApprovals?: boolean
  trackDeposits?: boolean
  trackErrors?: boolean
  trackRetries?: boolean
}

export function useAnalyticsTransaction({
  enabled = true,
  trackApprovals = true,
  trackDeposits = true,
  trackErrors = true,
  trackRetries = true,
}: TransactionAnalyticsProps = {}) {
  const transactionStartTimeRef = useRef<number>(0)
  const approvalStartTimeRef = useRef<number>(0)
  const depositStartTimeRef = useRef<number>(0)
  const retryCountRef = useRef<number>(0)

  // Track approve button click
  const trackApproveClick = useCallback(async (tokenSymbol: string, amount: string, tokenAddress: string) => {
    if (!enabled || !trackApprovals) return

    approvalStartTimeRef.current = Date.now()

    try {
      await serverAnalytics.approveClicked({
        token_symbol: tokenSymbol,
        token_address: tokenAddress,
        amount: amount,
        amount_numeric: parseFloat(amount) || 0,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track approve click:', error)
    }
  }, [enabled, trackApprovals])

  // Track approve transaction submission
  const trackApproveSubmitted = useCallback(async (tokenSymbol: string, amount: string, txHash: string) => {
    if (!enabled || !trackApprovals) return

    try {
      await serverAnalytics.approveSubmitted({
        token_symbol: tokenSymbol,
        amount: amount,
        tx_hash: txHash,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track approve submission:', error)
    }
  }, [enabled, trackApprovals])

  // Track successful approve transaction
  const trackApproveSuccess = useCallback(async (tokenSymbol: string, amount: string, txHash: string, gasUsed?: string, gasPrice?: string) => {
    if (!enabled || !trackApprovals) return

    const duration = approvalStartTimeRef.current ? Date.now() - approvalStartTimeRef.current : 0

    try {
      await serverAnalytics.approveSucceeded(txHash, {
        token_symbol: tokenSymbol,
        amount: amount,
        gas_used: gasUsed,
        gas_price: gasPrice,
        duration_ms: duration,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track approve success:', error)
    }
  }, [enabled, trackApprovals])

  // Track failed approve transaction
  const trackApproveFailure = useCallback(async (tokenSymbol: string, amount: string, error: Error, txHash?: string) => {
    if (!enabled || !trackApprovals) return

    const duration = approvalStartTimeRef.current ? Date.now() - approvalStartTimeRef.current : 0

    try {
      await serverAnalytics.approveRejected(error.message, {
        token_symbol: tokenSymbol,
        amount: amount,
        tx_hash: txHash,
        error_code: error.name,
        duration_ms: duration,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track approve failure:', analyticsError)
    }
  }, [enabled, trackApprovals])

  // Track deposit button click
  const trackDepositClick = useCallback(async (tokenSymbol: string, amount: string, strategyId: string) => {
    if (!enabled || !trackDeposits) return

    depositStartTimeRef.current = Date.now()
    transactionStartTimeRef.current = Date.now()

    try {
      await serverAnalytics.depositClicked({
        token_symbol: tokenSymbol,
        amount: amount,
        strategy_id: strategyId,
        amount_numeric: parseFloat(amount) || 0,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track deposit click:', error)
    }
  }, [enabled, trackDeposits])

  // Track deposit transaction submission
  const trackDepositSubmitted = useCallback(async (tokenSymbol: string, amount: string, strategyId: string, txHash: string) => {
    if (!enabled || !trackDeposits) return

    try {
      await serverAnalytics.depositSubmitted({
        token_symbol: tokenSymbol,
        amount: amount,
        strategy_id: strategyId,
        tx_hash: txHash,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track deposit submission:', error)
    }
  }, [enabled, trackDeposits])

  // Track successful deposit transaction
  const trackDepositSuccess = useCallback(async (tokenSymbol: string, amount: string, strategyId: string, txHash: string, gasUsed?: string, gasPrice?: string) => {
    if (!enabled || !trackDeposits) return

    const duration = depositStartTimeRef.current ? Date.now() - depositStartTimeRef.current : 0
    const totalDuration = transactionStartTimeRef.current ? Date.now() - transactionStartTimeRef.current : 0

    try {
      await serverAnalytics.depositSucceeded(txHash, {
        token_symbol: tokenSymbol,
        amount: amount,
        strategy_id: strategyId,
        gas_used: gasUsed,
        gas_price: gasPrice,
        deposit_duration_ms: duration,
        total_flow_duration_ms: totalDuration,
        retry_count: retryCountRef.current,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track deposit success:', error)
    }
  }, [enabled, trackDeposits])

  // Track failed deposit transaction
  const trackDepositFailure = useCallback(async (tokenSymbol: string, amount: string, strategyId: string, error: Error, txHash?: string) => {
    if (!enabled || !trackDeposits) return

    const duration = depositStartTimeRef.current ? Date.now() - depositStartTimeRef.current : 0
    const totalDuration = transactionStartTimeRef.current ? Date.now() - transactionStartTimeRef.current : 0

    try {
      await serverAnalytics.depositRejected(error.message, {
        token_symbol: tokenSymbol,
        amount: amount,
        strategy_id: strategyId,
        tx_hash: txHash,
        error_code: error.name,
        deposit_duration_ms: duration,
        total_flow_duration_ms: totalDuration,
        retry_count: retryCountRef.current,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track deposit failure:', analyticsError)
    }
  }, [enabled, trackDeposits])

  // Track transaction retry
  const trackTransactionRetry = useCallback(async (transactionType: 'approve' | 'deposit', tokenSymbol: string, amount: string, retryReason: string) => {
    if (!enabled || !trackRetries) return

    retryCountRef.current++

    try {
      await serverAnalytics.track('transaction_retry', {
        transaction_type: transactionType,
        token_symbol: tokenSymbol,
        amount: amount,
        retry_reason: retryReason,
        retry_count: retryCountRef.current,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction retry:', error)
    }
  }, [enabled, trackRetries])

  // Track transaction cancellation
  const trackTransactionCancel = useCallback(async (transactionType: 'approve' | 'deposit', tokenSymbol: string, amount: string, reason: string) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('transaction_cancelled', {
        transaction_type: transactionType,
        token_symbol: tokenSymbol,
        amount: amount,
        cancel_reason: reason,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction cancellation:', error)
    }
  }, [enabled])

  // Track transaction timeout
  const trackTransactionTimeout = useCallback(async (transactionType: 'approve' | 'deposit', tokenSymbol: string, amount: string, timeoutMs: number) => {
    if (!enabled || !trackErrors) return

    try {
      await serverAnalytics.track('transaction_timeout', {
        transaction_type: transactionType,
        token_symbol: tokenSymbol,
        amount: amount,
        timeout_ms: timeoutMs,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction timeout:', error)
    }
  }, [enabled, trackErrors])

  // Track gas estimation
  const trackGasEstimation = useCallback(async (transactionType: 'approve' | 'deposit', tokenSymbol: string, estimatedGas: string, gasPrice: string) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('gas_estimated', {
        transaction_type: transactionType,
        token_symbol: tokenSymbol,
        estimated_gas: estimatedGas,
        gas_price: gasPrice,
        estimated_cost_eth: (parseFloat(estimatedGas) * parseFloat(gasPrice)) / 1e18,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track gas estimation:', error)
    }
  }, [enabled])

  // Track transaction confirmation
  const trackTransactionConfirmation = useCallback(async (transactionType: 'approve' | 'deposit', tokenSymbol: string, txHash: string, confirmations: number) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('transaction_confirmed', {
        transaction_type: transactionType,
        token_symbol: tokenSymbol,
        tx_hash: txHash,
        confirmations: confirmations,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction confirmation:', error)
    }
  }, [enabled])

  // Reset retry count
  const resetRetryCount = useCallback(() => {
    retryCountRef.current = 0
  }, [])

  // Reset transaction timers
  const resetTransactionTimers = useCallback(() => {
    transactionStartTimeRef.current = 0
    approvalStartTimeRef.current = 0
    depositStartTimeRef.current = 0
  }, [])

  return {
    // Approve flow tracking
    trackApproveClick,
    trackApproveSubmitted,
    trackApproveSuccess,
    trackApproveFailure,
    
    // Deposit flow tracking
    trackDepositClick,
    trackDepositSubmitted,
    trackDepositSuccess,
    trackDepositFailure,
    
    // General transaction tracking
    trackTransactionRetry,
    trackTransactionCancel,
    trackTransactionTimeout,
    trackGasEstimation,
    trackTransactionConfirmation,
    
    // Utility functions
    resetRetryCount,
    resetTransactionTimers,
  }
}

// Hook for tracking transaction modal interactions
export function useAnalyticsTransactionModal() {
  const trackModalOpen = useCallback(async (transactionType: 'approve' | 'deposit', tokenSymbol: string, amount: string) => {
    try {
      await serverAnalytics.track('transaction_modal_opened', {
        transaction_type: transactionType,
        token_symbol: tokenSymbol,
        amount: amount,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction modal open:', error)
    }
  }, [])

  const trackModalClose = useCallback(async (transactionType: 'approve' | 'deposit', reason: 'success' | 'cancelled' | 'error') => {
    try {
      await serverAnalytics.track('transaction_modal_closed', {
        transaction_type: transactionType,
        reason,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction modal close:', error)
    }
  }, [])

  const trackModalStepChange = useCallback(async (transactionType: 'approve' | 'deposit', step: 'confirm' | 'pending' | 'success' | 'error') => {
    try {
      await serverAnalytics.track('transaction_modal_step_changed', {
        transaction_type: transactionType,
        step,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track transaction modal step change:', error)
    }
  }, [])

  return {
    trackModalOpen,
    trackModalClose,
    trackModalStepChange,
  }
}

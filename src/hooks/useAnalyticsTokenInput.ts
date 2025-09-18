/*
  Analytics hook for token selection and amount input tracking
  Tracks user interactions with token selection and amount input fields
*/

import { useCallback, useEffect, useRef } from 'react'
import { serverAnalytics } from '../utils/analytics-server'

interface TokenInputAnalyticsProps {
  enabled?: boolean
  debounceMs?: number
  trackAmountChanges?: boolean
  trackTokenChanges?: boolean
  trackInputFocus?: boolean
  trackInputBlur?: boolean
}

export function useAnalyticsTokenInput({
  enabled = true,
  debounceMs = 1000,
  trackAmountChanges = true,
  trackTokenChanges = true,
  trackInputFocus = true,
  trackInputBlur = true,
}: TokenInputAnalyticsProps = {}) {
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const lastAmountRef = useRef<string>('')
  const lastTokenRef = useRef<string>('')
  const focusTimeRef = useRef<number>(0)

  // Track token selection
  const trackTokenSelection = useCallback(async (tokenSymbol: string, tokenAddress?: string, previousToken?: string) => {
    if (!enabled || !trackTokenChanges || tokenSymbol === lastTokenRef.current) return

    try {
      await serverAnalytics.tokenSelected(tokenSymbol, {
        token_address: tokenAddress,
        previous_token: previousToken,
        timestamp: Date.now(),
      })
      
      lastTokenRef.current = tokenSymbol
    } catch (error) {
      console.error('Analytics: Failed to track token selection:', error)
    }
  }, [enabled, trackTokenChanges])

  // Track amount changes with debouncing
  const trackAmountChange = useCallback(async (amount: string, tokenSymbol: string, inputType: 'manual' | 'max' | 'clear' = 'manual') => {
    if (!enabled || !trackAmountChanges || amount === lastAmountRef.current) return

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    // Set new timeout for debounced tracking
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        await serverAnalytics.amountChanged(amount, tokenSymbol, {
          input_type: inputType,
          amount_numeric: parseFloat(amount) || 0,
          has_decimal: amount.includes('.'),
          decimal_places: amount.includes('.') ? amount.split('.')[1]?.length || 0 : 0,
          timestamp: Date.now(),
        })
        
        lastAmountRef.current = amount
      } catch (error) {
        console.error('Analytics: Failed to track amount change:', error)
      }
    }, debounceMs)
  }, [enabled, trackAmountChanges, debounceMs])

  // Track input focus
  const trackInputFocus = useCallback(async (inputType: 'amount' | 'token', tokenSymbol?: string) => {
    if (!enabled || !trackInputFocus) return

    focusTimeRef.current = Date.now()

    try {
      await serverAnalytics.track('input_focused', {
        input_type: inputType,
        token_symbol: tokenSymbol,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track input focus:', error)
    }
  }, [enabled, trackInputFocus])

  // Track input blur
  const trackInputBlur = useCallback(async (inputType: 'amount' | 'token', tokenSymbol?: string, finalAmount?: string) => {
    if (!enabled || !trackInputBlur) return

    const focusDuration = focusTimeRef.current ? Date.now() - focusTimeRef.current : 0

    try {
      await serverAnalytics.track('input_blurred', {
        input_type: inputType,
        token_symbol: tokenSymbol,
        final_amount: finalAmount,
        focus_duration_ms: focusDuration,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track input blur:', error)
    }
  }, [enabled, trackInputBlur])

  // Track max button click
  const trackMaxButtonClick = useCallback(async (tokenSymbol: string, maxAmount: string, currentAmount: string) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('max_button_clicked', {
        token_symbol: tokenSymbol,
        max_amount: maxAmount,
        previous_amount: currentAmount,
        amount_increase: parseFloat(maxAmount) - parseFloat(currentAmount || '0'),
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track max button click:', error)
    }
  }, [enabled])

  // Track clear button click
  const trackClearButtonClick = useCallback(async (tokenSymbol: string, clearedAmount: string) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('clear_button_clicked', {
        token_symbol: tokenSymbol,
        cleared_amount: clearedAmount,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track clear button click:', error)
    }
  }, [enabled])

  // Track token balance check
  const trackBalanceCheck = useCallback(async (tokenSymbol: string, balance: string, isSufficient: boolean) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('balance_checked', {
        token_symbol: tokenSymbol,
        balance: balance,
        is_sufficient: isSufficient,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track balance check:', error)
    }
  }, [enabled])

  // Track amount validation
  const trackAmountValidation = useCallback(async (
    tokenSymbol: string,
    amount: string,
    validationResult: 'valid' | 'insufficient_balance' | 'invalid_format' | 'zero_amount' | 'exceeds_max'
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('amount_validated', {
        token_symbol: tokenSymbol,
        amount: amount,
        validation_result: validationResult,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track amount validation:', error)
    }
  }, [enabled])

  // Track token search
  const trackTokenSearch = useCallback(async (searchQuery: string, resultsCount: number) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('token_search', {
        search_query: searchQuery,
        results_count: resultsCount,
        query_length: searchQuery.length,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track token search:', error)
    }
  }, [enabled])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    // Core tracking functions
    trackTokenSelection,
    trackAmountChange,
    trackInputFocus,
    trackInputBlur,
    
    // Button interactions
    trackMaxButtonClick,
    trackClearButtonClick,
    
    // Validation and checks
    trackBalanceCheck,
    trackAmountValidation,
    trackTokenSearch,
  }
}

// Hook for tracking token selector modal interactions
export function useAnalyticsTokenModal() {
  const trackModalOpen = useCallback(async (trigger: 'button' | 'search' | 'popular') => {
    try {
      await serverAnalytics.track('token_modal_opened', {
        trigger,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track token modal open:', error)
    }
  }, [])

  const trackModalClose = useCallback(async (reason: 'selected' | 'cancelled' | 'backdrop') => {
    try {
      await serverAnalytics.track('token_modal_closed', {
        reason,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track token modal close:', error)
    }
  }, [])

  const trackTokenCategorySelect = useCallback(async (category: 'popular' | 'all' | 'custom') => {
    try {
      await serverAnalytics.track('token_category_selected', {
        category,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track token category selection:', error)
    }
  }, [])

  return {
    trackModalOpen,
    trackModalClose,
    trackTokenCategorySelect,
  }
}

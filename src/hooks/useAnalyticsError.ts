/*
  Centralized error tracking hook for analytics
  Provides unified error tracking across all components and flows
*/

import { useCallback } from 'react'
import { serverAnalytics } from '../utils/analytics-server'

interface ErrorTrackingProps {
  enabled?: boolean
  trackUserErrors?: boolean
  trackSystemErrors?: boolean
  trackNetworkErrors?: boolean
  trackValidationErrors?: boolean
}

export function useAnalyticsError({
  enabled = true,
  trackUserErrors = true,
  trackSystemErrors = true,
  trackNetworkErrors = true,
  trackValidationErrors = true,
}: ErrorTrackingProps = {}) {
  
  // Track user action errors
  const trackUserError = useCallback(async (
    errorType: 'wallet_connection' | 'transaction_failed' | 'insufficient_balance' | 'invalid_input' | 'user_rejected',
    errorMessage: string,
    context?: Record<string, any>
  ) => {
    if (!enabled || !trackUserErrors) return

    try {
      await serverAnalytics.errorShown(errorMessage, errorType, {
        error_category: 'user_error',
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track user error:', analyticsError)
    }
  }, [enabled, trackUserErrors])

  // Track system errors
  const trackSystemError = useCallback(async (
    errorType: 'api_error' | 'rpc_error' | 'contract_error' | 'network_error' | 'unknown_error',
    errorMessage: string,
    context?: Record<string, any>
  ) => {
    if (!enabled || !trackSystemErrors) return

    try {
      await serverAnalytics.errorShown(errorMessage, errorType, {
        error_category: 'system_error',
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track system error:', analyticsError)
    }
  }, [enabled, trackSystemErrors])

  // Track network errors
  const trackNetworkError = useCallback(async (
    errorType: 'connection_timeout' | 'request_failed' | 'rate_limit' | 'server_error',
    errorMessage: string,
    context?: Record<string, any>
  ) => {
    if (!enabled || !trackNetworkErrors) return

    try {
      await serverAnalytics.errorShown(errorMessage, errorType, {
        error_category: 'network_error',
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track network error:', analyticsError)
    }
  }, [enabled, trackNetworkErrors])

  // Track validation errors
  const trackValidationError = useCallback(async (
    errorType: 'invalid_amount' | 'invalid_address' | 'insufficient_allowance' | 'invalid_token',
    errorMessage: string,
    context?: Record<string, any>
  ) => {
    if (!enabled || !trackValidationErrors) return

    try {
      await serverAnalytics.errorShown(errorMessage, errorType, {
        error_category: 'validation_error',
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track validation error:', analyticsError)
    }
  }, [enabled, trackValidationErrors])

  // Track generic errors
  const trackError = useCallback(async (
    error: Error,
    errorCategory: 'user_error' | 'system_error' | 'network_error' | 'validation_error' = 'system_error',
    context?: Record<string, any>
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.errorShown(error.message, error.name, {
        error_category: errorCategory,
        error_stack: error.stack,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error:', analyticsError)
    }
  }, [enabled])

  // Track error recovery
  const trackErrorRecovery = useCallback(async (
    errorType: string,
    recoveryAction: 'retry' | 'fallback' | 'user_action' | 'automatic',
    context?: Record<string, any>
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('error_recovery', {
        original_error_type: errorType,
        recovery_action: recoveryAction,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error recovery:', analyticsError)
    }
  }, [enabled])

  // Track error dismissal
  const trackErrorDismissal = useCallback(async (
    errorType: string,
    dismissalMethod: 'close_button' | 'auto_dismiss' | 'page_navigation',
    context?: Record<string, any>
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('error_dismissed', {
        error_type: errorType,
        dismissal_method: dismissalMethod,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error dismissal:', analyticsError)
    }
  }, [enabled])

  // Track error reporting
  const trackErrorReport = useCallback(async (
    errorType: string,
    reportType: 'user_report' | 'automatic_report' | 'debug_info',
    context?: Record<string, any>
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('error_reported', {
        error_type: errorType,
        report_type: reportType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error report:', analyticsError)
    }
  }, [enabled])

  // Track error patterns
  const trackErrorPattern = useCallback(async (
    patternType: 'repeated_error' | 'error_cascade' | 'error_cluster',
    errorTypes: string[],
    context?: Record<string, any>
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('error_pattern_detected', {
        pattern_type: patternType,
        error_types: errorTypes,
        error_count: errorTypes.length,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error pattern:', analyticsError)
    }
  }, [enabled])

  // Track performance errors
  const trackPerformanceError = useCallback(async (
    errorType: 'slow_load' | 'timeout' | 'memory_issue' | 'render_error',
    errorMessage: string,
    context?: Record<string, any>
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('performance_error', {
        error_type: errorType,
        error_message: errorMessage,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track performance error:', analyticsError)
    }
  }, [enabled])

  // Track error context
  const trackErrorContext = useCallback(async (
    errorType: string,
    context: {
      page?: string
      component?: string
      user_action?: string
      wallet_connected?: boolean
      chain_id?: number
      token_symbol?: string
      amount?: string
    }
  ) => {
    if (!enabled) return

    try {
      await serverAnalytics.track('error_context', {
        error_type: errorType,
        ...context,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error context:', analyticsError)
    }
  }, [enabled])

  return {
    // Specific error type tracking
    trackUserError,
    trackSystemError,
    trackNetworkError,
    trackValidationError,
    
    // Generic error tracking
    trackError,
    
    // Error lifecycle tracking
    trackErrorRecovery,
    trackErrorDismissal,
    trackErrorReport,
    
    // Error analysis
    trackErrorPattern,
    trackPerformanceError,
    trackErrorContext,
  }
}

// Hook for tracking error boundary interactions
export function useAnalyticsErrorBoundary() {
  const trackErrorBoundaryTrigger = useCallback(async (error: Error, errorInfo: any) => {
    try {
      await serverAnalytics.track('error_boundary_triggered', {
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error boundary:', analyticsError)
    }
  }, [])

  const trackErrorBoundaryReset = useCallback(async () => {
    try {
      await serverAnalytics.track('error_boundary_reset', {
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track error boundary reset:', analyticsError)
    }
  }, [])

  return {
    trackErrorBoundaryTrigger,
    trackErrorBoundaryReset,
  }
}

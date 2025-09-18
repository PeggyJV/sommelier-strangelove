/*
  Analytics Provider component that integrates all analytics hooks
  Provides a centralized way to manage analytics across the application
*/

import React, { createContext, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { useAnalyticsWallet } from '../../hooks/useAnalyticsWallet'
import { useAnalyticsTokenInput } from '../../hooks/useAnalyticsTokenInput'
import { useAnalyticsTransaction } from '../../hooks/useAnalyticsTransaction'
import { useAnalyticsError } from '../../hooks/useAnalyticsError'
import { useAnalyticsUI } from '../../hooks/useAnalyticsUI'
import { serverAnalytics } from '../../utils/analytics-server'

interface AnalyticsContextType {
  // Wallet analytics
  wallet: ReturnType<typeof useAnalyticsWallet>
  
  // Token input analytics
  tokenInput: ReturnType<typeof useAnalyticsTokenInput>
  
  // Transaction analytics
  transaction: ReturnType<typeof useAnalyticsTransaction>
  
  // Error analytics
  error: ReturnType<typeof useAnalyticsError>
  
  // UI analytics
  ui: ReturnType<typeof useAnalyticsUI>
  
  // Direct analytics access
  analytics: typeof serverAnalytics
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null)

interface AnalyticsProviderProps {
  children: ReactNode
  enabled?: boolean
  trackPageViews?: boolean
  trackWalletEvents?: boolean
  trackTokenEvents?: boolean
  trackTransactionEvents?: boolean
  trackErrorEvents?: boolean
  trackUIEvents?: boolean
}

export function AnalyticsProvider({
  children,
  enabled = true,
  trackPageViews = true,
  trackWalletEvents = true,
  trackTokenEvents = true,
  trackTransactionEvents = true,
  trackErrorEvents = true,
  trackUIEvents = true,
}: AnalyticsProviderProps) {
  const router = useRouter()
  
  // Initialize all analytics hooks
  const wallet = useAnalyticsWallet({
    enabled: enabled && trackWalletEvents,
    trackPageViews: trackPageViews,
    trackChainSwitches: true,
  })
  
  const tokenInput = useAnalyticsTokenInput({
    enabled: enabled && trackTokenEvents,
    debounceMs: 1000,
    trackAmountChanges: true,
    trackTokenChanges: true,
    trackInputFocus: true,
    trackInputBlur: true,
  })
  
  const transaction = useAnalyticsTransaction({
    enabled: enabled && trackTransactionEvents,
    trackApprovals: true,
    trackDeposits: true,
    trackErrors: true,
    trackRetries: true,
  })
  
  const error = useAnalyticsError({
    enabled: enabled && trackErrorEvents,
    trackUserErrors: true,
    trackSystemErrors: true,
    trackNetworkErrors: true,
    trackValidationErrors: true,
  })
  
  const ui = useAnalyticsUI({
    enabled: enabled && trackUIEvents,
    trackTooltips: true,
    trackModals: true,
    trackButtons: true,
    trackNavigation: true,
  })

  // Track page views on route changes
  useEffect(() => {
    if (!enabled || !trackPageViews) return

    const handleRouteChange = async (url: string) => {
      try {
        await serverAnalytics.pageView(url, {
          referrer: document.referrer,
          timestamp: Date.now(),
        })
      } catch (error) {
        console.error('Analytics: Failed to track page view:', error)
      }
    }

    // Track initial page load
    handleRouteChange(router.asPath)

    // Track route changes
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router, enabled, trackPageViews])

  // Global error handling
  useEffect(() => {
    if (!enabled || !trackErrorEvents) return

    const handleGlobalError = (event: ErrorEvent) => {
      error.trackSystemError('unknown_error', event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      error.trackSystemError('promise_rejection', event.reason?.message || 'Unhandled promise rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      })
    }

    window.addEventListener('error', handleGlobalError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleGlobalError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [enabled, trackErrorEvents, error])

  // Performance monitoring
  useEffect(() => {
    if (!enabled) return

    const trackPerformance = async () => {
      try {
        // Track page load performance
        if (window.performance && window.performance.timing) {
          const timing = window.performance.timing
          const loadTime = timing.loadEventEnd - timing.navigationStart
          
          await serverAnalytics.track('page_performance', {
            load_time_ms: loadTime,
            dom_ready_ms: timing.domContentLoadedEventEnd - timing.navigationStart,
            first_paint_ms: timing.responseStart - timing.navigationStart,
            timestamp: Date.now(),
          })
        }

        // Track Core Web Vitals if available
        if ('web-vitals' in window) {
          // This would be implemented with the web-vitals library
          // await trackWebVitals()
        }
      } catch (error) {
        console.error('Analytics: Failed to track performance:', error)
      }
    }

    // Track performance after page load
    if (document.readyState === 'complete') {
      trackPerformance()
    } else {
      window.addEventListener('load', trackPerformance)
      return () => window.removeEventListener('load', trackPerformance)
    }
  }, [enabled])

  const contextValue: AnalyticsContextType = {
    wallet,
    tokenInput,
    transaction,
    error,
    ui,
    analytics: serverAnalytics,
  }

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  )
}

// Hook to use analytics context
export function useAnalytics(): AnalyticsContextType {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

// Hook for specific analytics categories
export function useAnalyticsWallet() {
  const { wallet } = useAnalytics()
  return wallet
}

export function useAnalyticsTokenInput() {
  const { tokenInput } = useAnalytics()
  return tokenInput
}

export function useAnalyticsTransaction() {
  const { transaction } = useAnalytics()
  return transaction
}

export function useAnalyticsError() {
  const { error } = useAnalytics()
  return error
}

export function useAnalyticsUI() {
  const { ui } = useAnalytics()
  return ui
}

// Direct analytics access
export function useAnalyticsDirect() {
  const { analytics } = useAnalytics()
  return analytics
}

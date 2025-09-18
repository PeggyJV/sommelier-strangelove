/*
  Analytics hook for wallet connection and disconnection tracking
  Integrates with existing wallet context to track user interactions
*/

import { useEffect, useCallback } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { serverAnalytics } from '../utils/analytics-server'

interface WalletAnalyticsProps {
  enabled?: boolean
  trackPageViews?: boolean
  trackChainSwitches?: boolean
}

export function useAnalyticsWallet({
  enabled = true,
  trackPageViews = true,
  trackChainSwitches = true,
}: WalletAnalyticsProps = {}) {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  // Track wallet connection
  const trackWalletConnect = useCallback(async (connectorName: string, chainId?: number) => {
    if (!enabled) return

    try {
      await serverAnalytics.walletConnected(address || '', {
        connector: connectorName,
        chain_id: chainId,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track wallet connection:', error)
    }
  }, [enabled, address])

  // Track wallet disconnection
  const trackWalletDisconnect = useCallback(async () => {
    if (!enabled) return

    try {
      await serverAnalytics.walletDisconnected({
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track wallet disconnection:', error)
    }
  }, [enabled])

  // Track chain switch attempts
  const trackChainSwitchAttempt = useCallback(async (targetChainId: number, connectorName?: string) => {
    if (!enabled || !trackChainSwitches) return

    try {
      await serverAnalytics.chainSwitchAttempted(targetChainId, {
        from_chain: chainId,
        connector: connectorName,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track chain switch attempt:', error)
    }
  }, [enabled, trackChainSwitches, chainId])

  // Track successful chain switch
  const trackChainSwitchSuccess = useCallback(async (targetChainId: number, connectorName?: string) => {
    if (!enabled || !trackChainSwitches) return

    try {
      await serverAnalytics.chainSwitchSucceeded(targetChainId, {
        from_chain: chainId,
        connector: connectorName,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track chain switch success:', error)
    }
  }, [enabled, trackChainSwitches, chainId])

  // Track failed chain switch
  const trackChainSwitchFailure = useCallback(async (targetChainId: number, error: Error, connectorName?: string) => {
    if (!enabled || !trackChainSwitches) return

    try {
      await serverAnalytics.chainSwitchFailed(targetChainId, error.message, {
        from_chain: chainId,
        connector: connectorName,
        error_code: error.name,
        timestamp: Date.now(),
      })
    } catch (analyticsError) {
      console.error('Analytics: Failed to track chain switch failure:', analyticsError)
    }
  }, [enabled, trackChainSwitches, chainId])

  // Enhanced connect function with analytics
  const connectWithAnalytics = useCallback(async (connectorId: string) => {
    const connector = connectors.find(c => c.id === connectorId)
    if (!connector) return

    try {
      await connect({ connector })
      await trackWalletConnect(connector.name, chainId)
    } catch (error) {
      console.error('Wallet connection failed:', error)
      // Track connection failure
      await serverAnalytics.errorShown(
        `Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'WALLET_CONNECT_FAILED',
        {
          connector: connector.name,
          connector_id: connectorId,
        }
      )
    }
  }, [connect, connectors, chainId, trackWalletConnect])

  // Enhanced disconnect function with analytics
  const disconnectWithAnalytics = useCallback(async () => {
    try {
      await trackWalletDisconnect()
      await disconnect()
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
      await serverAnalytics.errorShown(
        `Wallet disconnection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'WALLET_DISCONNECT_FAILED'
      )
    }
  }, [disconnect, trackWalletDisconnect])

  // Enhanced switch chain function with analytics
  const switchChainWithAnalytics = useCallback(async (targetChainId: number) => {
    try {
      await trackChainSwitchAttempt(targetChainId)
      await switchChain({ chainId: targetChainId })
      await trackChainSwitchSuccess(targetChainId)
    } catch (error) {
      await trackChainSwitchFailure(targetChainId, error as Error)
      throw error // Re-throw to maintain existing behavior
    }
  }, [switchChain, trackChainSwitchAttempt, trackChainSwitchSuccess, trackChainSwitchFailure])

  // Track page views when wallet status changes
  useEffect(() => {
    if (!enabled || !trackPageViews) return

    const trackPageView = async () => {
      try {
        await serverAnalytics.pageView(window.location.pathname, {
          wallet_connected: isConnected,
          wallet_address: address ? 'connected' : 'disconnected', // Don't send actual address
          chain_id: chainId,
          timestamp: Date.now(),
        })
      } catch (error) {
        console.error('Analytics: Failed to track page view:', error)
      }
    }

    trackPageView()
  }, [enabled, trackPageViews, isConnected, address, chainId])

  return {
    // Enhanced functions with analytics
    connectWithAnalytics,
    disconnectWithAnalytics,
    switchChainWithAnalytics,
    
    // Direct tracking functions
    trackWalletConnect,
    trackWalletDisconnect,
    trackChainSwitchAttempt,
    trackChainSwitchSuccess,
    trackChainSwitchFailure,
    
    // Current state
    isConnected,
    address,
    chainId,
  }
}

// Hook for tracking wallet connection modal interactions
export function useAnalyticsWalletModal() {
  const trackModalOpen = useCallback(async (trigger: string) => {
    try {
      await serverAnalytics.track('wallet_modal_opened', {
        trigger,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track wallet modal open:', error)
    }
  }, [])

  const trackModalClose = useCallback(async (reason: 'connected' | 'cancelled' | 'backdrop') => {
    try {
      await serverAnalytics.track('wallet_modal_closed', {
        reason,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track wallet modal close:', error)
    }
  }, [])

  const trackConnectorSelect = useCallback(async (connectorName: string) => {
    try {
      await serverAnalytics.track('wallet_connector_selected', {
        connector: connectorName,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error('Analytics: Failed to track connector selection:', error)
    }
  }, [])

  return {
    trackModalOpen,
    trackModalClose,
    trackConnectorSelect,
  }
}

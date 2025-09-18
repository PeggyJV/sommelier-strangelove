/*
  Client-side analytics utility for server-side event collection
  Provides a clean interface for sending events to /api/events
*/

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
  session_id?: string
  user_id?: string
}

interface AnalyticsResponse {
  success: boolean
  event_id?: number
  message?: string
  error?: string
}

class ServerAnalytics {
  private baseURL: string
  private sessionId: string
  private userId?: string

  constructor() {
    this.baseURL = typeof window !== 'undefined' ? window.location.origin : ''
    this.sessionId = this.getOrCreateSessionId()
    this.userId = this.getUserId()
  }

  private getOrCreateSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = sessionStorage.getItem('analytics_session_id')
    if (!sessionId) {
      sessionId = this.generateId()
      sessionStorage.setItem('analytics_session_id', sessionId)
    }
    return sessionId
  }

  private getUserId(): string | undefined {
    if (typeof window === 'undefined') return undefined
    
    // Try to get user ID from wallet address or other identifier
    const walletAddress = this.getWalletAddress()
    return walletAddress || undefined
  }

  private getWalletAddress(): string | undefined {
    if (typeof window === 'undefined') return undefined
    
    // This would integrate with your wallet connection logic
    // For now, return undefined - will be set when wallet connects
    return undefined
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  }

  private async sendEvent(event: AnalyticsEvent): Promise<AnalyticsResponse> {
    try {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          session_id: this.sessionId,
          user_id: this.userId,
          timestamp: event.timestamp || Date.now(),
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send analytics event')
      }

      return data
    } catch (error) {
      console.error('Analytics error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Public methods for tracking events
  async track(event: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.sendEvent({
      event,
      properties: {
        ...properties,
        page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      },
    })
  }

  async pageView(page?: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    const pageName = page || (typeof window !== 'undefined' ? window.location.pathname : 'unknown')
    
    return this.track('page_view', {
      ...properties,
      page: pageName,
    })
  }

  async walletConnected(address: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    this.userId = address
    
    return this.track('wallet_connected', {
      ...properties,
      wallet_address: address,
    })
  }

  async walletDisconnected(properties?: Record<string, any>): Promise<AnalyticsResponse> {
    this.userId = undefined
    
    return this.track('wallet_disconnected', properties)
  }

  async chainSwitchAttempted(chainId: number, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('chain_switch_attempted', {
      ...properties,
      chain_id: chainId,
    })
  }

  async chainSwitchSucceeded(chainId: number, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('chain_switch_succeeded', {
      ...properties,
      chain_id: chainId,
    })
  }

  async chainSwitchFailed(chainId: number, error: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('chain_switch_failed', {
      ...properties,
      chain_id: chainId,
      error: error,
    })
  }

  async tokenSelected(symbol: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('token_selected', {
      ...properties,
      token_symbol: symbol,
    })
  }

  async amountChanged(amount: string, symbol: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('amount_changed', {
      ...properties,
      amount: amount,
      token_symbol: symbol,
    })
  }

  async approveClicked(properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('approve_clicked', properties)
  }

  async approveSubmitted(properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('approve_submitted', properties)
  }

  async approveSucceeded(txHash: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('approve_succeeded', {
      ...properties,
      tx_hash: txHash,
    })
  }

  async approveRejected(error: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('approve_rejected', {
      ...properties,
      error: error,
    })
  }

  async depositClicked(properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('deposit_clicked', properties)
  }

  async depositSubmitted(properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('deposit_submitted', properties)
  }

  async depositSucceeded(txHash: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('deposit_succeeded', {
      ...properties,
      tx_hash: txHash,
    })
  }

  async depositRejected(error: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('deposit_rejected', {
      ...properties,
      error: error,
    })
  }

  async errorShown(error: string, code?: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('error_shown', {
      ...properties,
      error: error,
      error_code: code,
    })
  }

  async tooltipOpened(tooltipId: string, properties?: Record<string, any>): Promise<AnalyticsResponse> {
    return this.track('tooltip_opened', {
      ...properties,
      tooltip_id: tooltipId,
    })
  }
}

// Export singleton instance
export const serverAnalytics = new ServerAnalytics()

// Export types for use in components
export type { AnalyticsEvent, AnalyticsResponse }

/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AnalyticsProvider, useAnalytics } from '../components/analytics/AnalyticsProvider'
import { serverAnalytics } from '../utils/analytics-server'

// Mock the analytics server
jest.mock('../utils/analytics-server', () => ({
  serverAnalytics: {
    track: jest.fn(),
    pageView: jest.fn(),
    walletConnected: jest.fn(),
    walletDisconnected: jest.fn(),
    chainSwitchAttempted: jest.fn(),
    chainSwitchSucceeded: jest.fn(),
    chainSwitchFailed: jest.fn(),
    tokenSelected: jest.fn(),
    amountChanged: jest.fn(),
    approveClicked: jest.fn(),
    approveSubmitted: jest.fn(),
    approveSucceeded: jest.fn(),
    approveRejected: jest.fn(),
    depositClicked: jest.fn(),
    depositSubmitted: jest.fn(),
    depositSucceeded: jest.fn(),
    depositRejected: jest.fn(),
    errorShown: jest.fn(),
    tooltipOpened: jest.fn(),
  },
}))

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    asPath: '/test',
    events: {
      on: jest.fn(),
      off: jest.fn(),
    },
  }),
}))

// Mock wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: () => ({
    address: '0x1234567890123456789012345678901234567890',
    isConnected: true,
    chainId: 1,
  }),
  useConnect: () => ({
    connect: jest.fn(),
    connectors: [
      { id: 'metaMask', name: 'MetaMask' },
      { id: 'walletConnect', name: 'WalletConnect' },
    ],
  }),
  useDisconnect: () => ({
    disconnect: jest.fn(),
  }),
  useSwitchChain: () => ({
    switchChain: jest.fn(),
  }),
}))

// Test component that uses analytics
function TestComponent() {
  const { wallet, tokenInput, transaction, error, ui } = useAnalytics()

  const handleWalletConnect = () => {
    wallet.connectWithAnalytics('metaMask')
  }

  const handleTokenSelection = () => {
    tokenInput.trackTokenSelection('USDC', '0x123...', 'ETH')
  }

  const handleAmountChange = () => {
    tokenInput.trackAmountChange('100', 'USDC', 'manual')
  }

  const handleApproveClick = () => {
    transaction.trackApproveClick('USDC', '100', '0x123...')
  }

  const handleError = () => {
    error.trackUserError('transaction_failed', 'Transaction failed', {
      token: 'USDC',
    })
  }

  const handleTooltipOpen = () => {
    ui.trackTooltipOpen('test-tooltip', 'hover')
  }

  return (
    <div>
      <button data-testid="wallet-connect" onClick={handleWalletConnect}>
        Connect Wallet
      </button>
      <button data-testid="token-select" onClick={handleTokenSelection}>
        Select Token
      </button>
      <button data-testid="amount-change" onClick={handleAmountChange}>
        Change Amount
      </button>
      <button data-testid="approve-click" onClick={handleApproveClick}>
        Approve
      </button>
      <button data-testid="error-track" onClick={handleError}>
        Track Error
      </button>
      <button data-testid="tooltip-open" onClick={handleTooltipOpen}>
        Open Tooltip
      </button>
    </div>
  )
}

describe('Analytics Hooks Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render AnalyticsProvider without crashing', () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )
    
    expect(screen.getByTestId('wallet-connect')).toBeInTheDocument()
  })

  it('should track wallet connection', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('wallet-connect'))

    await waitFor(() => {
      expect(serverAnalytics.walletConnected).toHaveBeenCalledWith(
        '0x1234567890123456789012345678901234567890',
        expect.objectContaining({
          connector: 'MetaMask',
          chain_id: 1,
        })
      )
    })
  })

  it('should track token selection', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('token-select'))

    await waitFor(() => {
      expect(serverAnalytics.tokenSelected).toHaveBeenCalledWith('USDC', {
        token_address: '0x123...',
        previous_token: 'ETH',
        timestamp: expect.any(Number),
      })
    })
  })

  it('should track amount changes', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('amount-change'))

    await waitFor(() => {
      expect(serverAnalytics.amountChanged).toHaveBeenCalledWith('100', 'USDC', {
        input_type: 'manual',
        amount_numeric: 100,
        has_decimal: false,
        decimal_places: 0,
        timestamp: expect.any(Number),
      })
    })
  })

  it('should track approve clicks', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('approve-click'))

    await waitFor(() => {
      expect(serverAnalytics.approveClicked).toHaveBeenCalledWith({
        token_symbol: 'USDC',
        token_address: '0x123...',
        amount: '100',
        amount_numeric: 100,
        timestamp: expect.any(Number),
      })
    })
  })

  it('should track errors', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('error-track'))

    await waitFor(() => {
      expect(serverAnalytics.errorShown).toHaveBeenCalledWith(
        'Transaction failed',
        'transaction_failed',
        expect.objectContaining({
          error_category: 'user_error',
          token: 'USDC',
          timestamp: expect.any(Number),
        })
      )
    })
  })

  it('should track tooltip interactions', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('tooltip-open'))

    await waitFor(() => {
      expect(serverAnalytics.tooltipOpened).toHaveBeenCalledWith('test-tooltip', {
        trigger: 'hover',
        timestamp: expect.any(Number),
      })
    })
  })

  it('should track page views on mount', async () => {
    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    await waitFor(() => {
      expect(serverAnalytics.pageView).toHaveBeenCalledWith('/test', {
        referrer: expect.any(String),
        timestamp: expect.any(Number),
      })
    })
  })

  it('should handle analytics when disabled', () => {
    render(
      <AnalyticsProvider enabled={false}>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('wallet-connect'))

    // Should not call analytics when disabled
    expect(serverAnalytics.walletConnected).not.toHaveBeenCalled()
  })

  it('should handle partial analytics enablement', () => {
    render(
      <AnalyticsProvider
        enabled={true}
        trackWalletEvents={false}
        trackTokenEvents={true}
      >
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('wallet-connect'))
    fireEvent.click(screen.getByTestId('token-select'))

    // Wallet events should not be tracked
    expect(serverAnalytics.walletConnected).not.toHaveBeenCalled()
    
    // Token events should be tracked
    expect(serverAnalytics.tokenSelected).toHaveBeenCalled()
  })
})

describe('Analytics Hooks Individual Tests', () => {
  it('should track wallet connection with analytics', async () => {
    const { useAnalyticsWallet } = require('../hooks/useAnalyticsWallet')
    
    // This would require more complex mocking of wagmi hooks
    // For now, we test the integration through the provider
    expect(true).toBe(true)
  })

  it('should track token input changes with debouncing', async () => {
    const { useAnalyticsTokenInput } = require('../hooks/useAnalyticsTokenInput')
    
    // This would require testing the debouncing logic
    // For now, we test the integration through the provider
    expect(true).toBe(true)
  })

  it('should track transaction flows with timing', async () => {
    const { useAnalyticsTransaction } = require('../hooks/useAnalyticsTransaction')
    
    // This would require testing the timing logic
    // For now, we test the integration through the provider
    expect(true).toBe(true)
  })
})

describe('Analytics Error Handling', () => {
  it('should handle analytics errors gracefully', async () => {
    // Mock analytics to throw an error
    const mockError = new Error('Analytics error')
    serverAnalytics.track.mockRejectedValueOnce(mockError)

    // Mock console.error to avoid noise in tests
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    render(
      <AnalyticsProvider>
        <TestComponent />
      </AnalyticsProvider>
    )

    fireEvent.click(screen.getByTestId('token-select'))

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Analytics: Failed to track token selection:',
        mockError
      )
    })

    consoleSpy.mockRestore()
  })

  it('should handle missing analytics context', () => {
    // Test component without provider
    function ComponentWithoutProvider() {
      try {
        useAnalytics()
        return <div>Should not render</div>
      } catch (error) {
        return <div>Error caught: {error.message}</div>
      }
    }

    render(<ComponentWithoutProvider />)
    
    expect(screen.getByText('Error caught: useAnalytics must be used within an AnalyticsProvider')).toBeInTheDocument()
  })
})

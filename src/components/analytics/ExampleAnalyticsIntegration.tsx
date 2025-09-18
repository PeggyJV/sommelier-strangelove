/*
  Example component demonstrating how to integrate analytics hooks
  This shows how to add analytics tracking to existing components
*/

import React, { useState } from 'react'
import { Button, Input, VStack, HStack, Text, Box } from '@chakra-ui/react'
import { useAnalytics } from './AnalyticsProvider'

interface ExampleAnalyticsIntegrationProps {
  strategyId: string
  tokenSymbol: string
  onDeposit?: (amount: string) => void
}

export function ExampleAnalyticsIntegration({
  strategyId,
  tokenSymbol,
  onDeposit,
}: ExampleAnalyticsIntegrationProps) {
  const [amount, setAmount] = useState('')
  const [isApproving, setIsApproving] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  
  // Get analytics hooks
  const { wallet, tokenInput, transaction, error, ui } = useAnalytics()

  // Handle amount input with analytics
  const handleAmountChange = (value: string) => {
    setAmount(value)
    tokenInput.trackAmountChange(value, tokenSymbol, 'manual')
  }

  // Handle amount input focus/blur with analytics
  const handleAmountFocus = () => {
    tokenInput.trackInputFocus('amount', tokenSymbol)
  }

  const handleAmountBlur = () => {
    tokenInput.trackInputBlur('amount', tokenSymbol, amount)
  }

  // Handle max button click with analytics
  const handleMaxClick = () => {
    const maxAmount = '1000' // This would come from actual balance
    const previousAmount = amount
    setAmount(maxAmount)
    
    tokenInput.trackMaxButtonClick(tokenSymbol, maxAmount, previousAmount)
    tokenInput.trackAmountChange(maxAmount, tokenSymbol, 'max')
  }

  // Handle approve with analytics
  const handleApprove = async () => {
    try {
      setIsApproving(true)
      
      // Track approve click
      await transaction.trackApproveClick(tokenSymbol, amount, 'token-address')
      
      // Simulate approve transaction
      const txHash = '0x123...' // This would be the actual transaction hash
      await transaction.trackApproveSubmitted(tokenSymbol, amount, txHash)
      
      // Simulate success
      await transaction.trackApproveSuccess(tokenSymbol, amount, txHash, '21000', '20000000000')
      
    } catch (err) {
      await transaction.trackApproveFailure(tokenSymbol, amount, err as Error)
      await error.trackUserError('transaction_failed', 'Approve transaction failed', {
        token_symbol: tokenSymbol,
        amount: amount,
      })
    } finally {
      setIsApproving(false)
    }
  }

  // Handle deposit with analytics
  const handleDeposit = async () => {
    try {
      setIsDepositing(true)
      
      // Track deposit click
      await transaction.trackDepositClick(tokenSymbol, amount, strategyId)
      
      // Simulate deposit transaction
      const txHash = '0x456...' // This would be the actual transaction hash
      await transaction.trackDepositSubmitted(tokenSymbol, amount, strategyId, txHash)
      
      // Simulate success
      await transaction.trackDepositSuccess(tokenSymbol, amount, strategyId, txHash, '50000', '20000000000')
      
      // Call the actual deposit function
      onDeposit?.(amount)
      
    } catch (err) {
      await transaction.trackDepositFailure(tokenSymbol, amount, strategyId, err as Error)
      await error.trackUserError('transaction_failed', 'Deposit transaction failed', {
        token_symbol: tokenSymbol,
        amount: amount,
        strategy_id: strategyId,
      })
    } finally {
      setIsDepositing(false)
    }
  }

  // Handle button clicks with analytics
  const handleButtonClick = (buttonId: string, buttonType: 'primary' | 'secondary') => {
    ui.trackButtonClick(buttonId, buttonType, {
      strategy_id: strategyId,
      token_symbol: tokenSymbol,
    })
  }

  // Handle tooltip interactions with analytics
  const handleTooltipOpen = (tooltipId: string) => {
    ui.trackTooltipOpen(tooltipId, 'hover', {
      context: 'deposit_form',
      token_symbol: tokenSymbol,
    })
  }

  // Handle copy to clipboard with analytics
  const handleCopyToClipboard = (content: string, contentType: 'address' | 'amount') => {
    navigator.clipboard.writeText(content)
    ui.trackCopyToClipboard(contentType, content, {
      strategy_id: strategyId,
      token_symbol: tokenSymbol,
    })
  }

  return (
    <VStack spacing={4} align="stretch" p={4}>
      <Text fontSize="lg" fontWeight="semibold">
        Deposit {tokenSymbol} to {strategyId}
      </Text>
      
      {/* Amount Input */}
      <Box>
        <Text fontSize="sm" mb={2}>
          Amount
        </Text>
        <HStack>
          <Input
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onFocus={handleAmountFocus}
            onBlur={handleAmountBlur}
            placeholder="0.00"
            type="number"
          />
          <Button
            size="sm"
            variant="outline"
            onClick={handleMaxClick}
            onMouseEnter={() => handleTooltipOpen('max-button-tooltip')}
          >
            Max
          </Button>
        </HStack>
      </Box>

      {/* Action Buttons */}
      <HStack spacing={4}>
        <Button
          colorScheme="blue"
          onClick={handleApprove}
          isLoading={isApproving}
          loadingText="Approving..."
          onMouseEnter={() => handleTooltipOpen('approve-button-tooltip')}
          onClick={() => handleButtonClick('approve-button', 'primary')}
        >
          Approve {tokenSymbol}
        </Button>
        
        <Button
          colorScheme="green"
          onClick={handleDeposit}
          isLoading={isDepositing}
          loadingText="Depositing..."
          onMouseEnter={() => handleTooltipOpen('deposit-button-tooltip')}
          onClick={() => handleButtonClick('deposit-button', 'primary')}
        >
          Deposit
        </Button>
      </HStack>

      {/* Copy to Clipboard Example */}
      <HStack spacing={4}>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleCopyToClipboard('0x1234...', 'address')}
        >
          Copy Address
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => handleCopyToClipboard(amount, 'amount')}
        >
          Copy Amount
        </Button>
      </HStack>
    </VStack>
  )
}

// Example of how to integrate analytics into existing components
export function ExistingComponentWithAnalytics() {
  const { ui, error } = useAnalytics()

  const handleExistingAction = async () => {
    try {
      // Your existing logic here
      console.log('Existing action performed')
      
      // Add analytics tracking
      ui.trackButtonClick('existing-action-button', 'primary', {
        component: 'ExistingComponentWithAnalytics',
      })
      
    } catch (err) {
      // Track errors
      error.trackSystemError('unknown_error', err instanceof Error ? err.message : 'Unknown error', {
        component: 'ExistingComponentWithAnalytics',
        action: 'existing_action',
      })
    }
  }

  return (
    <Button onClick={handleExistingAction}>
      Existing Action
    </Button>
  )
}

// Example of how to add analytics to a modal
export function ModalWithAnalytics({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { ui } = useAnalytics()

  const handleModalClose = (reason: 'close_button' | 'backdrop' | 'escape') => {
    ui.trackModalClose('example-modal', reason, {
      modal_type: 'confirmation',
    })
    onClose()
  }

  return (
    <Box>
      {/* Modal content */}
      <Button onClick={() => handleModalClose('close_button')}>
        Close Modal
      </Button>
    </Box>
  )
}

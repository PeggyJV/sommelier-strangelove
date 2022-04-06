import { Text, VStack } from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import { useState } from 'react'
import { useBrandedToast } from './chakra'

/**
 * This hook is static and will require a refactor once we know which methods need to be used to handle txs with wagmi.
 */
export const useSubmitTx = () => {
  const [isDisabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { addToast, update, close, closeAll } = useBrandedToast()

  const handleDeposit = () => {
    setDisabled(true)
    setLoading(true)
    addToast({
      heading: 'CAave Stablecoin Cellar deposit',
      body: <Text>Depositing 10.125 ETH into Cellar</Text>,
      isLoading: true,
      closeHandler: close,
      duration: null
    })
    setTimeout(handleDepositSuccess, 2000)
  }

  const handleDepositSuccess = () => {
    setDisabled(false)
    setLoading(false)
    update({
      heading: 'Success!',
      body: <Text>12345.678 ETH deposited into Cellar View on ETHScan</Text>,
      status: 'success',
      closeHandler: closeAll
    })
    addToast({
      heading: 'For your records',
      body: (
        <VStack align='flex-start'>
          <Text>
            You now have 12345.678 LP tokens available in this cellar. Lock your
            LP tokens for certain period of time to earn SOMM token rewards.
          </Text>
          <BaseButton variant='solid'>Start Earning</BaseButton>
        </VStack>
      ),
      status: 'info',
      duration: null
    })
  }

  const handleWithdrawError = () => {
    setDisabled(false)
    setLoading(false)
    update({
      heading: 'Withdrawal failed',
      body: (
        <Text>
          Sorry, something went wrong with this withdrawal. Please try again.
        </Text>
      ),
      status: 'error',
      closeHandler: closeAll
    })
  }

  const handleWithdraw = () => {
    setDisabled(true)
    setLoading(true)
    addToast({
      heading: 'CAave Stablecoin Cellar withdrawal',
      body: <Text>Withdrawing 10.125 ETH from Cellar</Text>,
      isLoading: true,
      closeHandler: close,
      duration: null
    })
    setTimeout(handleWithdrawError, 2000)
  }

  return {
    isDisabled,
    loading,
    handleDeposit,
    handleWithdraw
  }
}

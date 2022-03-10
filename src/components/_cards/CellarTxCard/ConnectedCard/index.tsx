import {
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import { CardHeading } from 'components/_typography/CardHeading'
import { useBrandedToast } from 'hooks/chakra'
import { useState, VFC } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { Card } from 'components/_cards/Card'
import {
  cardProps,
  disabledButtonProps,
  tabPanelProps,
  tabProps
} from './styles'
import { TxInput } from './TxInput'
import { ImCheckmark } from 'react-icons/im'
import { AiOutlineInfo } from 'react-icons/ai'
import { BiError } from 'react-icons/bi'

export const ConnectedCard: VFC = () => {
  const [isDisabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { addToast, update, close, closeAll } = useBrandedToast()

  // placeholder submit handler
  const handleDepositSubmit = () => {
    setDisabled(true)
    setLoading(true)
    addToast({
      body: <Text>Depositing 10.125 ETH into Cellar</Text>,
      isLoading: true,
      closeHandler: close,
      duration: null
    })
    setTimeout(() => {
      setDisabled(false)
      setLoading(false)
      update({
        body: <Text>12345.678 ETH deposited into Cellar View on ETHScan</Text>,
        status: 'success',
        closeHandler: closeAll,
        icon: ImCheckmark
      })
      addToast({
        body: (
          <VStack align='flex-start'>
            <Text>
              You now have 12345.678 LP tokens available in this cellar. Lock
              your LP tokens for certain period of time to earn SOMM token
              rewards.
            </Text>
            <BaseButton variant='solid'>Start Earning</BaseButton>
          </VStack>
        ),
        duration: null,
        icon: AiOutlineInfo
      })
    }, 2000)
  }

  const handleWithdrawSubmit = () => {
    setDisabled(true)
    setLoading(true)
    addToast({
      body: <Text>Withdrawing 10.125 ETH from Cellar</Text>,
      isLoading: true,
      closeHandler: close,
      duration: null
    })
    setTimeout(() => {
      setDisabled(false)
      setLoading(false)
      update({
        body: <Text>We're keeping your money 😈</Text>,
        status: 'error',
        closeHandler: closeAll,
        icon: BiError
      })
    }, 2000)
  }

  return (
    <Card
      display='flex'
      flexDir='column'
      justifyContent='center'
      h='auto'
      bg='backgrounds.dark'
    >
      <Tabs flex={1} isFitted pt={1}>
        <TabList color='white'>
          <Tab {...tabProps}>Deposit</Tab>
          <Tab {...tabProps}>Withdraw</Tab>
        </TabList>
        <TabPanels>
          <TabPanel {...tabPanelProps}>
            <VStack align='stretch' spacing={4}>
              <Card {...cardProps}>
                <VStack align='flex-start-'>
                  <CardHeading>wallet balance</CardHeading>
                  <HStack spacing={1}>
                    <Icon
                      as={FaEthereum}
                      boxSize={6}
                      color='text.body.dark'
                      bg='white'
                      p={1}
                      borderRadius='50%'
                    />{' '}
                    <Text>12345.678 ETH</Text>
                  </HStack>
                </VStack>
              </Card>
              <TxInput />
              <BaseButton
                isLoading={loading}
                disabled={isDisabled}
                onClick={handleDepositSubmit}
                {...disabledButtonProps}
              >
                Add Deposit
              </BaseButton>
            </VStack>
          </TabPanel>
          <TabPanel {...tabPanelProps}>
            <VStack align='stretch' spacing={4}>
              <Card {...cardProps}>
                <VStack align='flex-start-'>
                  <CardHeading>wallet balance</CardHeading>
                  <HStack spacing={1}>
                    <Icon
                      as={FaEthereum}
                      boxSize={6}
                      color='text.body.dark'
                      bg='white'
                      p={1}
                      borderRadius='50%'
                    />{' '}
                    <Text>12345.678 ETH</Text>
                  </HStack>
                </VStack>
              </Card>
              <TxInput disabled={isDisabled} />
              <BaseButton
                isLoading={loading}
                disabled={isDisabled}
                onClick={handleWithdrawSubmit}
                {...disabledButtonProps}
              >
                Withdraw
              </BaseButton>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}

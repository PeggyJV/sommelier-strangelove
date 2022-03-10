import {
  Box,
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

export const ConnectedCard: VFC = () => {
  const [isDisabled, setDisabled] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { addToast, update, closeAll } = useBrandedToast()

  // placeholder submit handler
  const handleSubmit = () => {
    setDisabled(true)
    setLoading(true)
    addToast({
      body: <Box>Hello</Box>,
      isLoading: true,
      closeHandler: closeAll
    })
    setTimeout(() => {
      setDisabled(false)
      setLoading(false)
      update({
        body: <Box>Goodbye!</Box>,
        status: 'success',
        closeHandler: closeAll
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
                onClick={handleSubmit}
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
                onClick={handleSubmit}
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

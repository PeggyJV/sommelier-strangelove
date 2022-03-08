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
import { VFC } from 'react'
import { FaEthereum } from 'react-icons/fa'
import { Card } from '../../Card'
import {
  cardProps,
  disabledButtonProps,
  tabPanelProps,
  tabProps
} from './styles'
import { TxInput } from './TxInput'

interface Props {
  isConnected: boolean
}

export const ConnectedCard: VFC<Props> = ({ isConnected }) => {
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
              <TxInput isConnected={isConnected} />
              <BaseButton disabled={false} {...disabledButtonProps}>
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
              <TxInput isConnected={isConnected} />
              <BaseButton disabled={false} {...disabledButtonProps}>
                Withdraw
              </BaseButton>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Card>
  )
}

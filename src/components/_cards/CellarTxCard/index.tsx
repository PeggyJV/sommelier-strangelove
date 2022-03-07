import {
  BoxProps,
  ButtonProps,
  HStack,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanelProps,
  TabPanels,
  TabProps,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { Card } from '../Card'
import { FaEthereum } from 'react-icons/fa'
import { TxInput } from './TxInput'
import ConnectButton from 'components/_buttons/ConnectButton'
import { useConnect } from 'wagmi'

interface Props extends BoxProps {
  isConnected: boolean
}

const tabProps: TabProps = {
  pb: 4,
  borderColor: 'uiChrome.dataBorder',
  _selected: {
    color: 'white',
    borderColor: 'brilliantRose.500'
  }
}

const tabPanelProps: TabPanelProps = {
  px: 0
}

const cardProps: BoxProps = {
  p: 4,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  bg: 'backgrounds.darker'
}

const disabledButtonProps: ButtonProps = {
  variant: 'solid',
  _disabled: {
    color: 'text.body.light',
    bg: 'text.body.darkMuted',
    cursor: 'not-allowed',
    _hover: {
      color: 'text.body.light',
      bg: 'text.body.darkMuted'
    }
  }
}

export const CellarTxCard: VFC<Props> = ({ isConnected }) => {
  const [auth] = useConnect()

  return (
    <Card
      display='flex'
      flexDir='column'
      justifyContent='center'
      h={isConnected ? 'auto' : '100%'}
      bg={isConnected ? 'backgrounds.dark' : 'backgrounds.darker'}
    >
      {isConnected ? (
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
      ) : (
        <VStack spacing={8} justify='center'>
          <Text color='text.body.lightMuted' maxW='30ch' textAlign='center'>
            Please connect your wallet to start investing.
          </Text>
          {auth.data.connectors.map(c => (
            <ConnectButton connector={c} key={c.id} />
          ))}
        </VStack>
      )}
    </Card>
  )
}

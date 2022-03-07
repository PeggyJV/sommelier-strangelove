import {
  BoxProps,
  Button,
  Flex,
  Icon,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack
} from '@chakra-ui/react'
import { BaseButton } from 'components/_buttons/BaseButton'
import { VFC } from 'react'
import { BsCircleFill } from 'react-icons/bs'
import { Card } from './Card'

interface Props extends BoxProps {
  isConnected: boolean
}

export const CellarTxCard: VFC<Props> = ({ isConnected }) => {
  return (
    <Card display='flex' flexDir='column' bg='backgrounds.dark'>
      <Tabs flex={1} isFitted pt={1} colorScheme='brilliantRose'>
        <TabList color='white'>
          <Tab>Deposit</Tab>
          <Tab>Withdraw</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <Card
              p={4}
              display='flex'
              justifyContent='space-between'
              alignItems='center'
              bg='backgrounds.darker'
            >
              <VStack spacing={1}>
                <Icon as={BsCircleFill} boxSize={14} color='gray.500' />
                <Text>DAI</Text>
              </VStack>
              <VStack spacing={6} align='flex-end'>
                <Text>Balance 123.4321 DAI</Text>
                <VStack align='flex-end'>
                  <Input
                    type='number'
                    fontSize='2xl'
                    defaultValue='00000000.00'
                    p={0}
                    maxW='11ch'
                    border='none'
                    textAlign='end'
                  />
                  <Button
                    bg='gray.900'
                    color='gray.100'
                    size='sm'
                    borderRadius={50}
                    _hover={{ bg: 'gray.700' }}
                  >
                    MAX
                  </Button>
                </VStack>
              </VStack>
            </Card>
          </TabPanel>
          <TabPanel p={0}>
            <Card bg='gray.600'>Idk what's supposed to be in here</Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <BaseButton variant='solid'>
        {isConnected ? 'Add Deposit' : 'Connect Wallet'}
      </BaseButton>
    </Card>
  )
}

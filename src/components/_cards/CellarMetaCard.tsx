import {
  Box,
  BoxProps,
  HStack,
  Icon,
  StackProps,
  Text,
  VStack
} from '@chakra-ui/react'
import { CardDivider } from 'components/_layout/CardDivider'
import { CardHeading } from 'components/_typography/cardHeading'
import { VFC } from 'react'
import { Card } from './Card'

const bottomRowCells: StackProps = {
  align: 'flex-start',
  flex: 1
}

const CellarMetaCard: VFC<BoxProps> = () => {
  return (
    <Card p={4} bg='backgrounds.dark'>
      <VStack spacing={4} align='stretch'>
        <Card p={4} bg='backgrounds.darker'>
          <HStack spacing={4} divider={<CardDivider />}>
            <VStack align='stretch' divider={<CardDivider />}>
              <Box>
                <CardHeading>
                  tvl <Icon boxSize={3} />
                </CardHeading>
                <HStack spacing={2}>
                  <Icon boxSize={4} />
                  <Text>12.3M USD</Text>
                </HStack>
              </Box>
              <VStack align='flex-start' justify='space-between'>
                <CardHeading>
                  apy <Icon boxSize={3} />
                </CardHeading>
                <Text>8.3%</Text>
              </VStack>
            </VStack>
            <VStack flex={1} align='flex-start'>
              <CardHeading>
                profit split <Icon boxSize={3} />
              </CardHeading>
            </VStack>
          </HStack>
        </Card>
        <Card p={4} bg='backgrounds.darker'>
          <HStack justify='space-between' divider={<CardDivider />}>
            <VStack align='flex-start'>
              <CardHeading>minimum deposit</CardHeading>
              <Text>100 USD</Text>
            </VStack>
            <VStack align='flex-end'>
              <CardHeading>deposit cap</CardHeading>
              <Text>2M USD</Text>
            </VStack>
          </HStack>
        </Card>
        <Card p={4} bg='backgrounds.darker'>
          <HStack spacing={4} justify='space-around' divider={<CardDivider />}>
            <VStack {...bottomRowCells}>
              <CardHeading>
                class <Icon boxSize={3} />
              </CardHeading>
              <Text>Stablecoin</Text>
            </VStack>
            <VStack {...bottomRowCells}>
              <CardHeading>asset</CardHeading>
              <Text>ETH</Text>
            </VStack>
            <VStack {...bottomRowCells}>
              <CardHeading>protocol</CardHeading>
              <Text>AAVE</Text>
            </VStack>
          </HStack>
        </Card>
      </VStack>
    </Card>
  )
}

export default CellarMetaCard

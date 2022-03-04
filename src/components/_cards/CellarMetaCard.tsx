import dynamic from 'next/dynamic'
import {
  Box,
  BoxProps,
  Circle,
  Grid,
  HStack,
  Icon,
  StackProps,
  Text,
  useTheme,
  VStack
} from '@chakra-ui/react'
import { CardDivider } from 'components/_layout/CardDivider'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { Card } from './Card'
const BarChart = dynamic(() => import('components/_charts/BarChart'), {
  ssr: false
})

const bottomRowCells: StackProps = {
  align: 'flex-start',
  flex: 1
}

const placeholderData = [
  {
    platform: 10,
    protocol: 10,
    depositors: 80
  }
]

const CellarMetaCard: VFC<BoxProps> = () => {
  const { colors } = useTheme()

  const colorPalette = [
    colors.electricIndigo[500],
    colors.deepSkyBlue[500],
    colors.brilliantRose[500]
  ]

  return (
    <Card bg='backgrounds.dark'>
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
            <VStack flex={1} spacing={6} align='flex-start'>
              <CardHeading>
                profit split <Icon boxSize={3} />
              </CardHeading>
              <Box w='100%' h='6px'>
                {/* @ts-ignore */}
                <BarChart
                  layout='horizontal'
                  colors={colorPalette}
                  keys={['platform', 'protocol', 'depositors']}
                  data={placeholderData}
                />
              </Box>
              <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                {Object.entries(placeholderData[0]).map(([key, value], i) => {
                  return (
                    <HStack key={i}>
                      <Circle size={4} bg={colorPalette[i]} />
                      <Text fontSize='sm'>
                        {key}: {value}%
                      </Text>
                    </HStack>
                  )
                })}
              </Grid>
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

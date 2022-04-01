import dynamic from 'next/dynamic'
import {
  Box,
  BoxProps,
  Circle,
  Grid,
  HStack,
  Icon,
  Text,
  VStack
} from '@chakra-ui/react'
import { CardDivider } from 'components/_layout/CardDivider'
import { CardHeading } from 'components/_typography/CardHeading'
import { VFC } from 'react'
import { Card } from './Card'
import { useNivoThemes } from 'hooks/nivo'
import { CardStat } from 'components/CardStat'
import { BsCurrencyDollar } from 'react-icons/bs'
import { FaEthereum } from 'react-icons/fa'
import { CardStatRow } from 'components/CardStatRow'
const BarChart = dynamic(() => import('components/_charts/BarChart'), {
  ssr: false
})

const placeholderData = [
  {
    platform: 10,
    protocol: 10,
    depositors: 80
  }
]

const CellarMetaCard: VFC<BoxProps> = () => {
  const { barChartTheme } = useNivoThemes()

  return (
    <Card p={2} bg='backgrounds.glassy' overflow='visible'>
      <VStack spacing={2} align='stretch'>
        <Card p={4} bg='backgrounds.black' overflow='visible'>
          <VStack spacing={4} divider={<CardDivider />} align='stretch'>
            <CardStatRow>
              <CardStat
                label='tvl'
                labelIcon
                stat='12.3M USD'
                statIcon={BsCurrencyDollar}
              />
              <CardStat label='management fee' labelIcon stat='8.35%' />
              <CardStat label='apy' labelIcon stat='8.35%' />
            </CardStatRow>
            <VStack flex={1} spacing={6} align='stretch'>
              <CardHeading>
                profit split <Icon boxSize={3} />
              </CardHeading>
              <Box w='100%' h='6px'>
                {/* @ts-ignore */}
                <BarChart
                  layout='horizontal'
                  colors={barChartTheme}
                  keys={['platform', 'protocol', 'depositors']}
                  data={placeholderData}
                />
              </Box>
              <Grid templateColumns='repeat(2, 1fr)' gap={2}>
                {Object.entries(placeholderData[0]).map(([key, value], i) => {
                  return (
                    <HStack key={i}>
                      <Circle size={4} bg={barChartTheme[i]} />
                      <Text fontSize='sm'>
                        {key}: {value}%
                      </Text>
                    </HStack>
                  )
                })}
              </Grid>
            </VStack>
          </VStack>
        </Card>
        <Card p={4} bg='backgrounds.black'>
          <CardStatRow>
            <CardStat
              label='minimum deposit'
              stat='100 USD'
              statIcon={BsCurrencyDollar}
            />
            <CardStat label='deposit asset' stat='ETH' statIcon={FaEthereum} />
            <CardStat
              label='deposit cap'
              stat='2M USD'
              statIcon={BsCurrencyDollar}
              align='flex-end'
            />
          </CardStatRow>
        </Card>
        <Card p={4} bg='backgrounds.black'>
          <CardStatRow>
            <CardStat label='class' labelIcon stat='Stablecoin' />
            <CardStat
              label='strategy asset'
              labelIcon
              stat='ETH'
              statIcon={FaEthereum}
            />
            <CardStat
              label='protocol'
              labelIcon
              stat='AAVE'
              statIcon={FaEthereum}
            />
          </CardStatRow>
        </Card>
      </VStack>
    </Card>
  )
}

export default CellarMetaCard

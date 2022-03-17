import dynamic from 'next/dynamic'
import { Box, BoxProps, Circle, HStack, Text, VStack } from '@chakra-ui/react'
import { Serie } from '@nivo/line'
import { VFC } from 'react'
import { Card } from './Card'
import { CardHeading } from 'components/_typography/CardHeading'
import { CardDivider } from 'components/_layout/CardDivider'
import { useNivoThemes } from 'hooks/nivo'
import { CardStat } from 'components/CardStat'
import { BsCurrencyDollar } from 'react-icons/bs'
import { CardStatColumn } from 'components/CardStatColumn'
const LineChart = dynamic(() => import('components/_charts/LineChart'), {
  ssr: false
})

interface Props extends BoxProps {
  data?: Serie[]
}

const cardProps: BoxProps = {
  p: 4,
  bg: 'backgrounds.darker'
}

const data: Serie[] = [
  {
    id: 1,
    data: [
      { x: 'bingus', y: 5 },
      { x: 'tingus', y: 15 },
      { x: 'lingus', y: 5 },
      { x: 'pingus', y: 25 },
      { x: 'shmingus', y: 18 }
    ]
  },
  {
    id: 2,
    data: [
      { x: 'bingus', y: 40 },
      { x: 'shmingus', y: 5 }
    ]
  }
]

export const PerformanceCard: VFC<Props> = props => {
  const { lineChartTheme } = useNivoThemes()

  return (
    <Card bg='backgrounds.dark' overflow='visible' {...props}>
      <HStack spacing={4} align='stretch'>
        <Card flex={1} overflow='visible' {...cardProps}>
          <VStack spacing={6} align='stretch' divider={<CardDivider />}>
            <Box h='20rem'>
              <HStack spacing={6}>
                <HStack spacing={1}>
                  <Circle bg='deepSkyBlue.500' size={3} />
                  <Text fontSize='xs'>Apy</Text>
                </HStack>
                <HStack spacing={1}>
                  <Circle bg='brilliantRose.500' size={3} />
                  <Text fontSize='xs'>Volume</Text>
                </HStack>
              </HStack>
              <LineChart
                data={data}
                colors={lineChartTheme}
                yScale={{
                  type: 'linear',
                  max: 60
                }}
              />
            </Box>
            <HStack justify='space-between'>
              <CardHeading>12am</CardHeading>
              <CardHeading>6am</CardHeading>
              <CardHeading>12pm</CardHeading>
              <CardHeading>6pm</CardHeading>
            </HStack>
          </VStack>
        </Card>
        <Card display='flex' alignItems='center' {...cardProps}>
          <CardStatColumn spacing={6}>
            <CardStat label='24h cellar apy' labelIcon stat='50%' />
            <CardStat
              label='24h volume'
              labelIcon
              stat='+12.5K USDC'
              statIcon={BsCurrencyDollar}
            />
            <CardStat
              label='my 24h returns'
              labelIcon
              stat='-'
              statIcon={BsCurrencyDollar}
            />
            <CardStat
              label='my 24h rewards'
              labelIcon
              stat='-'
              statIcon={BsCurrencyDollar}
            />
          </CardStatColumn>
        </Card>
      </HStack>
    </Card>
  )
}

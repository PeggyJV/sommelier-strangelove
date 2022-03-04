import dynamic from 'next/dynamic'
import {
  Box,
  BoxProps,
  HStack,
  Icon,
  StackProps,
  Text,
  VStack
} from '@chakra-ui/react'
import { Serie } from '@nivo/line'
import { VFC } from 'react'
import { Card } from './Card'
import { CardHeading } from 'components/_typography/CardHeading'
import { CardDivider } from 'components/_layout/CardDivider'
import { useNivoThemes } from 'hooks/nivo'
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

const topRowCells: StackProps = {
  align: 'flex-start'
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
      {x: 'bingus', y: 40},
      {x: 'shmingus', y: 5},
    ],
  }
]

export const PerformanceCard: VFC<Props> = props => {
  const { lineChartTheme } = useNivoThemes()

  return (
    <Card bg='backgrounds.dark' overflow='visible' {...props}>
      <VStack spacing={4} align='stretch'>
        <Card {...cardProps}>
          <HStack spacing={6} justify='space-between' divider={<CardDivider />}>
            <VStack {...topRowCells}>
              <CardHeading>
                24h cellar apy <Icon boxSize={3} />
              </CardHeading>
              <Text>+3.75%</Text>
            </VStack>
            <VStack {...topRowCells}>
              <CardHeading>
                24h volume <Icon boxSize={3} />
              </CardHeading>
              <Text>
                <Icon boxSize={5} /> +12.5K USD
              </Text>
            </VStack>
            <VStack {...topRowCells}>
              <CardHeading>my 24h returns</CardHeading>
              <Text>
                <Icon boxSize={5} /> -
              </Text>
            </VStack>
            <VStack {...topRowCells}>
              <CardHeading>
                my 24h rewards <Icon boxSize={3} />
              </CardHeading>
              <Text>
                <Icon boxSize={5} /> -
              </Text>
            </VStack>
          </HStack>
        </Card>
        <Card overflow='visible' {...cardProps}>
          <VStack spacing={6} align='stretch' divider={<CardDivider />}>
            <Box h='10rem'>
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
      </VStack>
    </Card>
  )
}

import {
  BoxProps,
  Circle,
  Grid,
  GridItem,
  GridItemProps,
  Heading,
  HStack,
  Text,
  VStack,
  Icon,
  StackProps,
  Box
} from '@chakra-ui/react'
import { VFC } from 'react'
import { Card } from './Card'
import { FaArrowRight } from 'react-icons/fa'
import { CardDivider } from 'components/_layout/CardDivider'
import { CardHeading } from 'components/_typography/CardHeading'
import { BaseButton } from 'components/_buttons/BaseButton'
import { Serie } from '@nivo/line'
import { useNivoThemes } from 'hooks/nivo'
import dynamic from 'next/dynamic'
import Link from 'components/Link'
import { Cellar } from 'generated/subgraph'
const LineChartArea = dynamic(
  () => import('components/_charts/LineChartArea'),
  { ssr: false }
)

interface Props extends Partial<Cellar> {
  isConnected: boolean
}

const gridItemProps: GridItemProps = {
  display: 'flex'
}

const topRow: GridItemProps = {
  ...gridItemProps,
  rowSpan: 2,
  colSpan: 1
}

const cardProps: BoxProps = {
  bg: 'backgrounds.darker',
  flex: 1,
  display: 'flex',
  flexDir: 'column',
  overflow: 'visible'
}

const bottomRowCells: StackProps = {
  align: 'flex-start'
}

const data: Serie[] = [
  {
    id: 1,
    data: [
      { x: 'bingus', y: 5 },
      { x: 'pingus', y: 10 },
      { x: 'dingus', y: 7 },
      { x: 'lingus', y: 15 },
      { x: 'gingus', y: 12 }
    ]
  }
]

export const CellarOverviewCard: VFC<Props> = ({
  isConnected,
  name,
  id,
  dayDatas,
  numWalletsActive
}) => {
  const { lineChartTheme } = useNivoThemes()
  console.log({ dayDatas })

  return (
    <Card py={8} bg='violentViolet'>
      <VStack spacing={6} align='stretch'>
        <HStack>
          <Circle size={8} bg='deepSkyBlue.400' />
          <Text>{name}</Text>
        </HStack>
        <Heading fontSize='4xl'>{name}</Heading>
        <Grid
          flex={1}
          gap={4}
          templateColumns='repeat(2, 1fr)'
          templateRows='repeat(3, 1fr)'
        >
          <GridItem {...topRow}>
            <Card {...cardProps}>
              <VStack flex={1} spacing={4} align='flex-start'>
                <Box>
                  <CardHeading>24 hour volume</CardHeading>
                  <HStack spacing={2}>
                    <Icon boxSize={4} />
                    <Text>+420,000 USD</Text>
                  </HStack>
                </Box>
                <Box flex={1} maxH='100%' minW='100%'>
                  <LineChartArea data={data} colors={lineChartTheme} />
                </Box>
              </VStack>
            </Card>
          </GridItem>
          <GridItem {...topRow}>
            <Card {...cardProps}>
              <VStack
                flex={1}
                align='stretch'
                justify='space-between'
                divider={<CardDivider />}
              >
                <VStack align='stretch'>
                  <CardHeading>
                    total value locked <Icon boxSize={3} />
                  </CardHeading>
                  <HStack spacing={2}>
                    <Icon boxSize={4} />
                    <Text>12.3M USD</Text>
                  </HStack>
                </VStack>
                <VStack align='flex-start' justify='space-between'>
                  <CardHeading>
                    apy <Icon boxSize={3} />
                  </CardHeading>
                  <Text>8.3%</Text>
                </VStack>
              </VStack>
            </Card>
          </GridItem>
          <GridItem colSpan={2}>
            <Card {...cardProps}>
              <HStack divider={<CardDivider />} justify='space-between'>
                <VStack {...bottomRowCells}>
                  <CardHeading>depositors</CardHeading>
                  <Text>{numWalletsActive}</Text>
                </VStack>
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
                  <CardHeading>protocal</CardHeading>
                  <Text>AAVE</Text>
                </VStack>
              </HStack>
            </Card>
          </GridItem>
        </Grid>
        {/* This link will change with the gql branch */}
        <Link href={`/cellars/${id}`} maxW='max-content'>
          <BaseButton variant='solid' icon={FaArrowRight}>
            {isConnected ? 'add deposit' : 'view cellar'}
          </BaseButton>
        </Link>
      </VStack>
    </Card>
  )
}

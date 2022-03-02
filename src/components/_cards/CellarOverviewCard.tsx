import {
  Button,
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
  TextProps,
  StackDivider,
  StackDividerProps
} from '@chakra-ui/react'
import { VFC } from 'react'
import { Card } from './Card'
import { FaArrowRight } from 'react-icons/fa'

interface Props {
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
  flex: 1
}

const cardHeading: TextProps = {
  textTransform: 'uppercase',
  color: 'text.body.lightMuted'
}

const stackDivider: StackDividerProps = {
  borderColor: 'uiChrome.dataBorder'
}

export const CellarOverviewCard: VFC<Props> = ({ isConnected }) => {
  return (
    <Card px={4} py={8} bg='violentViolet'>
      <VStack spacing={6} align='stretch'>
        <HStack>
          <Circle size={8} bg='deepSkyBlue.400' />
          <Text>Strategist Name</Text>
        </HStack>
        <Heading>Cellar Presentation Name</Heading>
        <Grid
          flex={1}
          gap={4}
          templateColumns='repeat(2, 1fr)'
          templateRows='repeat(3, 1fr)'
        >
          <GridItem {...topRow}>
            <Card {...cardProps}>
              <Text {...cardHeading}>24 hour volume</Text>
              <HStack spacing={2}>
                <Icon boxSize={4} />
                <Text>+420,000 USD</Text>
              </HStack>
            </Card>
          </GridItem>
          <GridItem {...topRow}>
            <Card {...cardProps}>
              <VStack
                align='stretch'
                divider={<StackDivider {...stackDivider} />}
              >
                <VStack align='stretch'>
                  <Text {...cardHeading}>
                    total value locked <Icon boxSize={3} />
                  </Text>
                  <HStack spacing={2}>
                    <Icon boxSize={4} />
                    <Text>12.3M USD</Text>
                  </HStack>
                </VStack>
                <VStack align='stretch'>
                  <Text {...cardHeading}>
                    apy <Icon boxSize={3} />
                  </Text>
                  <Text>8.3%</Text>
                </VStack>
              </VStack>
            </Card>
          </GridItem>
          <GridItem colSpan={2}>
            <Card {...cardProps}>
              <HStack divider={<StackDivider {...stackDivider} />}>
                <VStack>
                  <Text {...cardHeading}>depositors</Text>
                  <Text>2000</Text>
                </VStack>
                <VStack>
                  <Text {...cardHeading}>
                    class <Icon boxSize={3} />
                  </Text>
                  <Text>Stablecoin</Text>
                </VStack>
                <VStack>
                  <Text {...cardHeading}>asset</Text>
                  <Text>ETH</Text>
                </VStack>
                <VStack>
                  <Text {...cardHeading}>protocal</Text>
                  <Text>AAVE</Text>
                </VStack>
              </HStack>
            </Card>
          </GridItem>
        </Grid>
        <Button variant='solid' rightIcon={<FaArrowRight />}>
          {isConnected ? 'add deposit' : 'view cellar'}
        </Button>
      </VStack>
    </Card>
  )
}

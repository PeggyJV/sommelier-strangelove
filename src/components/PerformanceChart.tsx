import dynamic from 'next/dynamic'
import {
  Box,
  BoxProps,
  Divider,
  Flex,
  Grid,
  GridItem,
  HStack,
  Select,
  Text,
  VStack
} from '@chakra-ui/react'
import { Serie } from '@nivo/line'
import { VFC } from 'react'
import { Card } from './_cards/Card'
const LineChart = dynamic(() => import('./_charts/LineChart'), { ssr: false })

const placeholderButtons = ['1D', '1W', '30D', '3M', '6M', '1Y']

interface Props extends BoxProps {
  data?: Serie[]
}

const data: Serie[] = [
  {
    id: 1,
    data: [
      { x: 'beep', y: 10 },
      { x: 'boop', y: 24 },
      { x: 'bingus', y: 5 },
      { x: 'dingus', y: 33 },
      { x: 'tingus', y: 15 },
      { x: 'singus', y: 40 }
    ]
  }
]

export const PerformanceChart: VFC<Props> = props => {
  return (
    <Card bg='gray.800' {...props}>
      <Grid templateRows='repeat(7, 1fr)'>
        <GridItem rowSpan={1}>
          <HStack spacing={6} justify='space-between'>
            <HStack flex={1}>
              <Text>Performance</Text>
              <Select>
                <Box as='option'>Total Value Locked</Box>
              </Select>
            </HStack>
            <Flex
              flex={1}
              h='40px'
              border='1px solid'
              borderColor='gray.100'
              borderRadius={5}
              overflow='hidden'
            >
              {placeholderButtons.map((button, i) => (
                <Box
                  flex={1}
                  key={i}
                  as='button'
                  bg={i === 0 ? 'gray.400' : ''}
                  borderRight='1px solid'
                  borderColor='inherit'
                  _last={{
                    borderRight: '0px'
                  }}
                >
                  {button}
                </Box>
              ))}
            </Flex>
          </HStack>
        </GridItem>
        {/* Chart goes here */}
        <GridItem rowSpan={4}>
          <LineChart data={data} />
        </GridItem>
        <GridItem rowSpan={2}>
          <Divider />
          <Flex justify='space-around' align='center'>
            <VStack flex={1}>
              <Text>$1,234,567.89</Text>
              <Text>Total Value Locked</Text>
            </VStack>
            <Divider h='60px' my={6} orientation='vertical' />
            <VStack flex={1}>
              <Text>+6.34%</Text>
              <Text>1D Volume</Text>
            </VStack>
          </Flex>
        </GridItem>
      </Grid>
    </Card>
  )
}

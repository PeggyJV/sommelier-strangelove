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
import { VFC } from 'react'
import { Card } from './_cards/Card'

const placeholderButtons = ['1D', '1W', '30D', '3M', '6M', '1Y']

export const PerformanceChart: VFC<BoxProps> = props => {
  return (
    <Card bg='gray.800' {...props}>
      <Grid templateRows='repeat(7, 1fr)'>
        <GridItem rowSpan={1}>
          <HStack spacing={6} justify='space-between'>
            <HStack flex={1}>
              <Text>Performance</Text>
              <Select>
                <Box as='option'>Total Value Locked1</Box>
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
        <GridItem rowSpan={4}></GridItem>
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

import {
  Grid,
  GridItem,
  GridProps,
  Text,
  TextProps,
  VStack
} from '@chakra-ui/react'
import { VFC } from 'react'

const headingProps: TextProps = {
  color: 'gray.400',
  fontSize: 'sm'
}

const textProps: TextProps = {
  fontSize: 'xl'
}

export const DepositStatusCard: VFC<GridProps> = props => {
  return (
    <Grid
      p={6}
      bg='gray.800'
      borderRadius={10}
      templateColumns='repeat(2, 1fr)'
      {...props}
    >
      <GridItem>
        <VStack>
          <Text {...headingProps}>Deposited</Text>
          <Text {...textProps}>209.3214 ETH</Text>
        </VStack>
      </GridItem>
      <GridItem>
        <VStack>
          <Text {...headingProps}>All Time Yield</Text>
          <Text {...textProps}>+23.45%</Text>
        </VStack>
      </GridItem>
    </Grid>
  )
}

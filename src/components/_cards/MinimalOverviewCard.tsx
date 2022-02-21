import { VFC } from 'react'
import {
  Grid,
  GridItem,
  GridProps,
  HStack,
  Icon,
  Text,
  TextProps,
  VStack
} from '@chakra-ui/react'
import { BsCircleFill } from 'react-icons/bs'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { Card } from './Card'

const headingProps: TextProps = {
  color: 'gray.400',
  fontSize: 'sm'
}

const textProps: TextProps = {
  fontSize: 'xl'
}

export const MinimalOverviewCard: VFC<GridProps> = props => {
  return (
    <Card bg='gray.800' {...props}>
      <Grid gap={6} templateColumns='repeat(3, 1fr)'>
        <GridItem>
          <VStack>
            <Text {...headingProps}>ID</Text>
            <Text maxW='10ch' isTruncated {...textProps}>
              12a2452abcdefghijklmnop
            </Text>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack>
            <Text {...headingProps}>Depositors</Text>
            <HStack>
              <Icon as={IoPersonCircleOutline} boxSize={7} />
              <Text {...textProps}>345</Text>
            </HStack>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack>
            <Text {...headingProps}>Asset</Text>
            <HStack>
              <Icon as={BsCircleFill} boxSize={6} color='gray.300' />
              <Text {...textProps}>ETH</Text>
            </HStack>
          </VStack>
        </GridItem>
      </Grid>
    </Card>
  )
}

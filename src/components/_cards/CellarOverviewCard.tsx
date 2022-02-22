import {
  Box,
  Flex,
  Grid,
  GridItem,
  HStack,
  Icon,
  Img,
  Text
} from '@chakra-ui/react'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { BsCircleFill } from 'react-icons/bs'
import { VFC } from 'react'
import { Card } from './Card'

interface Props {
  isConnected: boolean
}

export const CellarOverviewCard: VFC<Props> = ({ isConnected }) => {
  return (
    <Card p={0} bg='gray.100' color='gray.500'>
      <Grid
        p={6}
        gap={4}
        templateRows='repeat(5, 1fr)'
        templateColumns='repeat(7, 1fr)'
      >
        {/* Left-hand rows */}
        <GridItem rowSpan={2} colSpan={4} display='flex'>
          <Img src='/placeholders/aave.svg' boxSize={14} mr={4} />
          <Box flex={1}>
            <Text>AAVE</Text>
            <Text fontSize='xl' fontWeight='medium' color='gray.600'>
              Cellar name
            </Text>
          </Box>
        </GridItem>
        <GridItem rowSpan={3} colSpan={4} bg='gray.500' borderRadius={5} />
        {/* Right-hand rows */}
        <GridItem
          rowStart={1}
          rowSpan={2}
          colStart={5}
          colSpan={3}
          display='flex'
          justifyContent='space-between'
        >
          <Flex direction='column' align='center'>
            <Text>Depositors</Text>
            <HStack align='center'>
              <Icon as={IoPersonCircleOutline} boxSize={7} />
              <Text fontSize='xl' fontWeight='medium'>
                345
              </Text>
            </HStack>
          </Flex>
          <Flex direction='column' align='center'>
            <Text>Asset</Text>
            <HStack align='center'>
              <Icon as={BsCircleFill} boxSize={6} color='gray.300' />
              <Text fontSize='xl'>ETH</Text>
            </HStack>
          </Flex>
        </GridItem>
        <GridItem
          rowStart={3}
          rowSpan={3}
          colStart={5}
          colSpan={3}
          display='flex'
          flexDir='column'
          justifyContent='center'
        >
          <Flex justify='space-between'>
            <Text>1D TVL</Text>
            <Text color='gray.600'>$1,234,567.89</Text>
          </Flex>
          <Box borderTopWidth={1} borderColor='gray.400' my={2} />
          <Flex justify='space-between'>
            <Text>1D APY</Text>
            <Text color='gray.600'>+6.34%</Text>
          </Flex>
        </GridItem>
      </Grid>
      <Text
        py={3}
        bg='black'
        color='white'
        textAlign='center'
        fontFamily='mono'
      >
        {isConnected ? 'Add Deposit' : 'View Cellar'}
      </Text>
    </Card>
  )
}

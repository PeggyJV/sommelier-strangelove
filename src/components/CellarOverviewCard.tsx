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

export const CellarOverviewCard = () => {
  const placeholderDate = new Date().toLocaleDateString()

  return (
    <Box borderRadius={10} bg='gray.100' color='gray.500' overflow='hidden'>
      <Grid
        p={4}
        gap={4}
        templateRows='repeat(6, 1fr)'
        templateColumns='repeat(5, 1fr)'
      >
        {/* Left-hand rows */}
        <GridItem rowSpan={2} colSpan={3} display='flex'>
          <Img src='/placeholders/aave.svg' boxSize={14} mr={4} />
          <Box flex={1}>
            <Flex justify='space-between'>
              <Text>AAVE</Text>
              <Text>{placeholderDate}</Text>
            </Flex>
            <Flex justify='space-between'>
              <Text fontSize='xl' fontWeight='medium' color='gray.600'>
                Cellar name
              </Text>
              <Text color='green.400'>+5.41%</Text>
            </Flex>
          </Box>
        </GridItem>
        <GridItem rowSpan={3} colSpan={3} bg='gray.500' borderRadius={5} />
        {/* Right-hand rows */}
        <GridItem
          rowStart={1}
          rowSpan={2}
          colStart={4}
          colSpan={2}
          display='flex'
          justifyContent='space-between'
        >
          <Box>
            <Text>Depositors</Text>
            <HStack>
              <Icon as={IoPersonCircleOutline} boxSize={7} />
              <Text fontSize='xl' fontWeight='medium'>
                345
              </Text>
            </HStack>
          </Box>
          <Flex direction='column' align='center'>
            <Text>Asset</Text>
            <HStack>
              <Icon as={BsCircleFill} boxSize={6} />
              <Text fontSize='xl'>ETH</Text>
            </HStack>
          </Flex>
        </GridItem>
        <GridItem
          rowStart={3}
          rowSpan={3}
          colStart={4}
          colSpan={2}
          display='flex'
          flexDir='column'
          justifyContent='center'
        >
          <Flex justify='space-between'>
            <Text fontWeight='medium'>Net Asset Value</Text>
            <Text color='gray.600'>2,000</Text>
          </Flex>
          <Box borderTopWidth={1} borderColor='gray.400' my={2} />
          <Flex justify='space-between'>
            <Text fontWeight='medium'>Net Returns</Text>
            <Text color='gray.600'>478.34</Text>
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
        Add Deposit
      </Text>
    </Box>
  )
}

import { VFC } from 'react'
import {
  Grid,
  GridItem,
  GridItemProps,
  HStack,
  Icon,
  Text
} from '@chakra-ui/react'
import { BsCircleFill } from 'react-icons/bs'
import { IoPersonCircleOutline } from 'react-icons/io5'

const sharedProps: GridItemProps = {
  display: 'flex',
  flexDir: 'column',
  alignItems: 'center'
}

export const MinimalOverviewCard: VFC = () => {
  return (
    <Grid
      p={6}
      gap={6}
      templateColumns='repeat(3, 1fr)'
      bg='gray.800'
      borderRadius={10}
    >
      <GridItem {...sharedProps}>
        <Text>ID</Text>
        <Text maxW='10ch' isTruncated>
          12a2452abcdefghijklmnop
        </Text>
      </GridItem>
      <GridItem {...sharedProps}>
        <Text>Depositors</Text>
        <HStack align='center'>
          <Icon as={IoPersonCircleOutline} boxSize={7} />
          <Text fontSize='xl' fontWeight='medium'>
            345
          </Text>
        </HStack>
      </GridItem>
      <GridItem {...sharedProps}>
        <Text>Asset</Text>
        <HStack align='center'>
          <Icon as={BsCircleFill} boxSize={6} color='gray.300' />
          <Text fontSize='xl'>ETH</Text>
        </HStack>
      </GridItem>
    </Grid>
  )
}

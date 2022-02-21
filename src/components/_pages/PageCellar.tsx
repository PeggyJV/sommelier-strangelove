import {
  Divider,
  Grid,
  GridItem,
  GridProps,
  Heading,
  HeadingProps,
  HStack,
  Img,
  ListItem,
  Text,
  TextProps,
  UnorderedList,
  VStack
} from '@chakra-ui/react'
import { DepositStatusCard } from 'components/DepositStatusCard'
import Layout from 'components/Layout'
import { MinimalOverviewCard } from 'components/MinimalOverviewCard'
import { useConnect } from 'wagmi'

const gridProps: GridProps = {
  as: 'section',
  py: 6,
  gap: 6,
  templateColumns: 'repeat(6, 1fr)'
}

const textProps: TextProps = {
  pb: 4
}

const h2Props: HeadingProps = {
  as: 'h2',
  fontSize: '3xl',
  pb: 2
}

const PageCellar = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Layout>
      <Grid {...gridProps}>
        <GridItem colSpan={5}>
          <HStack pb={4} spacing={3}>
            <Img src='/placeholders/aave.svg' boxSize={14} />
            <Text fontSize='4xl' textTransform='uppercase'>
              aave
            </Text>
          </HStack>
          <Heading pb={4}>Cellar Name</Heading>
          <Heading {...h2Props}>Goal</Heading>
          <Text {...textProps}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            consectetur adipiscing elit iram ka onsectetur adipiscing elit, sed
            do eiusm incididunt ut labore et dolore{' '}
          </Text>
          <Heading {...h2Props}>Strategy</Heading>
          <Text {...textProps}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris varus ver
            ka irama consectetur adipiscing elit lit, sed do eiusam ad
            minionsectetur adipiscing elit, sed do eiusm adipiscing elit, sed do
            eiusmod tempor ver kama
          </Text>
          <UnorderedList>
            <ListItem>Deposit ETH into AAVE</ListItem>
            <ListItem>
              Deposit Eth into Compound/AAVE and then borrow lorem to deposit in
              to vault.
            </ListItem>
          </UnorderedList>
        </GridItem>
        <GridItem>
          <VStack spacing={6}>
            <MinimalOverviewCard w='100%' />
            {isConnected && <DepositStatusCard w='100%' />}
          </VStack>
        </GridItem>
      </Grid>
      <Divider />
      <Grid {...gridProps}></Grid>
    </Layout>
  )
}

export default PageCellar

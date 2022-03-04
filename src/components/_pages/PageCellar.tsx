import {
  Box,
  Flex,
  Grid,
  GridItem,
  GridProps,
  Heading,
  HeadingProps,
  HStack,
  StackDivider,
  Text,
  TextProps,
  VStack
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { PerformanceCard } from 'components/_cards/PerformanceCard'
import CellarMetaCard from 'components/_cards/CellarMetaCard'
import { CellarTxCard } from 'components/_cards/CellarTxCard'
// import { DepositStatusCard } from 'components/_cards/DepositStatusCard'
// import { MinimalOverviewCard } from 'components/_cards/MinimalOverviewCard'
import { Section } from 'components/_layout/Section'
import { useConnect } from 'wagmi'

const gridProps: GridProps = {
  gap: 4,
  templateColumns: 'repeat(6, 1fr)'
}

const textProps: TextProps = {
  pb: 4
}

const h2Props: HeadingProps = {
  color: 'brilliantRose.500',
  as: 'h2',
  fontSize: '3xl',
  pb: 2
}

const placeholderButtons = ['1D', '1W', '30D', '3M', '6M', '1Y', 'All Time']

const PageCellar = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Layout>
      <Section>
        <Grid {...gridProps}>
          <GridItem colSpan={3}>
            <Heading pb={4}>Strategy Presentation Name</Heading>
            <Heading {...h2Props}>Goals</Heading>
            <Text {...textProps}>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga.
            </Text>
            <Heading {...h2Props}>Strategy</Heading>
            <Text {...textProps}>
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident, similique sunt in culpa qui officia deserunt mollitia
              animi, id est laborum et dolorum fuga.
            </Text>
          </GridItem>
          <GridItem colSpan={3}>
            {/* <VStack spacing={6}>
              <MinimalOverviewCard w='100%' />
              {isConnected && <DepositStatusCard w='100%' />}
            </VStack> */}
            <CellarMetaCard />
          </GridItem>
        </Grid>
      </Section>
      <Section>
        <Grid {...gridProps}>
          <GridItem colSpan={4}>
            <VStack spacing={5} align='stretch'>
              <HStack justify='space-between'>
                <Heading fontSize='1.75rem'>Performance</Heading>
                <HStack
                  border='1px solid'
                  borderColor='electricIndigo.500'
                  borderRadius='2rem'
                  overflow='hidden'
                  justify='space-around'
                  spacing={0}
                  divider={<StackDivider borderColor='electricIndigo.500' />}
                >
                  {placeholderButtons.map((button, i) => (
                    <Box
                      flex={1}
                      px={4}
                      py={2}
                      key={i}
                      as='button'
                      bg={i === 0 ? 'electricIndigo.500' : ''}
                      fontSize='sm'
                      whiteSpace='nowrap'
                    >
                      {button}
                    </Box>
                  ))}
                </HStack>
              </HStack>
              <PerformanceCard />
            </VStack>
          </GridItem>
          <GridItem colSpan={2}>
            <CellarTxCard isConnected={isConnected} />
          </GridItem>
        </Grid>
      </Section>
    </Layout>
  )
}

export default PageCellar

import {
  Box,
  Grid,
  GridItem,
  GridProps,
  Heading,
  HStack,
  StackDivider,
  Text,
  VStack
} from '@chakra-ui/react'
import Layout from 'components/Layout'
import { PerformanceCard } from 'components/_cards/PerformanceCard'
import CellarMetaCard from 'components/_cards/CellarMetaCard'
import { CellarTxCard } from 'components/_cards/CellarTxCard'
import { Section } from 'components/_layout/Section'
import { useConnect } from 'wagmi'
import { UserPerformanceCard } from 'components/_cards/UserPerformanceCard'
import { BaseButton } from 'components/_buttons/BaseButton'
import { BreadCrumb } from 'components/BreadCrumb'
import { Copy } from './Copy'
import { VFC } from 'react'
import { BondingTable } from 'components/_tables/BondingTable'
import { CellarPageProps } from 'pages/cellars/[id]'
import { useGetCellarQuery } from 'generated/subgraph'

const gridProps: GridProps = {
  gap: 6,
  templateColumns: 'repeat(6, 1fr)'
}

const investGridProps: GridProps = {
  ...gridProps,
  rowGap: 4
}

const placeholderButtons = ['1D', '1W', 'All Time']

const PageCellar: VFC<CellarPageProps> = ({ data: staticData }) => {
  const [auth] = useConnect()
  const isConnected = auth.data.connected
  const { cellar: staticCellar } = staticData
  const { id, name } = staticCellar!
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: id
    }
  })
  const { data } = cellarResult

  const { cellar } = data || {}

  return (
    <Layout>
      <Section>
        <VStack spacing={4} align='stretch'>
          <BreadCrumb fontSize='xl' />
          <Heading pb={4}>{name}</Heading>
          <UserPerformanceCard />
        </VStack>
      </Section>
      <Section>
        <VStack spacing={4} align='stretch'>
          <Heading>Overview</Heading>
          <Grid {...gridProps}>
            <GridItem colSpan={3}>
              <Copy />
            </GridItem>
            <GridItem colSpan={3}>
              <CellarMetaCard />
            </GridItem>
          </Grid>
        </VStack>
      </Section>
      <Section>
        <VStack spacing={4} align='stretch'>
          <Heading>Invest</Heading>
          <Text>
            Deposit funds into this Cellar in order to become a Liquidity
            Provider and earn profits from the Cellar performance APY.
          </Text>
          <Grid {...investGridProps}>
            <GridItem colSpan={2}>
              <Heading fontSize='1.75rem'>Manage Liquidity</Heading>
            </GridItem>
            <GridItem colSpan={4}>
              <HStack justify='space-between' align='flex-end'>
                <VStack align='flex-start'>
                  <Heading fontSize='1.75rem'>Bonding Periods</Heading>
                  <Text>
                    Earn additional rewards after locking your LP tokens for a
                    specific period of time.
                  </Text>
                </VStack>
                <BaseButton variant='solid' disabled>
                  Unbond
                </BaseButton>
              </HStack>
            </GridItem>
            <GridItem colSpan={2}>
              <CellarTxCard isConnected={isConnected} />
            </GridItem>
            <GridItem colSpan={4}>
              <BondingTable />
            </GridItem>
          </Grid>
        </VStack>
      </Section>
      <Section>
        <VStack spacing={4} align='stretch'>
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
      </Section>
    </Layout>
  )
}

export default PageCellar

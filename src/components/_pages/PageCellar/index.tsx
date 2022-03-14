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

const gridProps: GridProps = {
  gap: 6,
  templateColumns: 'repeat(6, 1fr)'
}

const bottomGridProps: GridProps = {
  ...gridProps,
  rowGap: 7,
  templateRows: '30px 1fr'
}

const placeholderButtons = ['1D', '1W', 'All Time']

const PageCellar = () => {
  const [auth] = useConnect()

  const isConnected = auth.data.connected

  return (
    <Layout>
      <Section>
        <VStack spacing={4} align='stretch'>
          <BreadCrumb fontSize='xl' />
          <HStack spacing={4} justify='space-between'>
            <Heading pb={4}>Cellar Presentation Name</Heading>
            <HStack>
              <BaseButton flex={1} px={8} variant='solid'>
                Deposit/Withdraw
              </BaseButton>
              <BaseButton flex={1} px={8} variant='solid'>
                Bond Liquidity
              </BaseButton>
            </HStack>
          </HStack>
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
      <Section>
        <VStack spacing={4} align='stretch'>
          <Heading>Investments</Heading>
          <Text></Text>
          <Grid {...bottomGridProps}>
            <GridItem colSpan={2}>
              <Heading fontSize='1.75rem'>Deposits</Heading>
            </GridItem>
            <GridItem colSpan={4} />
            <GridItem colSpan={2}>
              <CellarTxCard isConnected={isConnected} />
            </GridItem>
          </Grid>
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

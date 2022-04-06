import { Button, Heading, HeadingProps, HStack, VStack } from '@chakra-ui/react'
import Layout from 'components/Layout'
import { PerformanceCard } from 'components/_cards/PerformanceCard'
import { Section } from 'components/_layout/Section'
import { useConnect } from 'wagmi'
import { PortfolioCard } from 'components/_cards/PortfolioCard'
import { VFC } from 'react'
import { CellarPageProps } from 'pages/cellars/[id]'
import { useGetCellarQuery } from 'generated/subgraph'
import StrategyBreakdownCard from 'components/_cards/StrategyBreakdownCard'
import CellarDetailsCard from 'components/_cards/CellarDetailsCard'
import Link from 'components/Link'
import { CellarStats } from 'components/CellarStats'
import { CellarTxCard } from 'components/_cards/CellarTxCard'

const h2Styles: HeadingProps = {
  as: 'h2',
  fontSize: 'lg',
  color: 'text.body.lightMuted'
}

const PageCellar: VFC<CellarPageProps> = ({ data: staticData }) => {
  const [auth] = useConnect()
  const isConnected = auth.data.connected
  const { cellar: staticCellar } = staticData
  const { id, name } = staticCellar!
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: id,
      cellarString: id
    }
  })
  const { data } = cellarResult

  return (
    <Layout>
      <Section>
        <CellarTxCard isConnected={isConnected} />
        <HStack spacing={4} pb={12} justify='space-between'>
          <HStack spacing={4}>
            <Link href='/'>
              <Button
                variant='outline'
                color='white'
                border='2px solid'
                borderColor='warmPink'
                _hover={{ bg: 'warmPink' }}
              >
                Back
              </Button>
            </Link>
            <Heading>C{name}</Heading>
          </HStack>
          <CellarStats tvm='$1.60M USDC' apy='8.88' trending='up' />
        </HStack>
        <VStack spacing={4} align='stretch'>
          <Heading {...h2Styles}>Your Portfolio</Heading>
          <PortfolioCard />
        </VStack>
      </Section>
      <Section>
        <VStack spacing={6} align='stretch'>
          <Heading {...h2Styles}>Cellar Details</Heading>
          <CellarDetailsCard />
          <StrategyBreakdownCard />
          <PerformanceCard />
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

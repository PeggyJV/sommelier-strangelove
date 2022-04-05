import { Heading, HeadingProps, VStack } from '@chakra-ui/react'
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
        <Heading pb={12}>{name}</Heading>
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

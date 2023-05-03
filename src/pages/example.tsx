import { Heading } from "@chakra-ui/react"
import { TokenChart } from "components/_charts/TokenValueChart"
import { Layout } from "components/_layout/Layout"
import { Section } from "components/_layout/Section"
import { cellarDataMap } from "data/cellarDataMap"
import { TokenPriceChartProvider } from "data/context/tokenPriceChartContext"

export default function exampleChart() {
  const cellarAddress = cellarDataMap["Real-Yield-ETH"].config.id

  return (
    <Layout>
      <Section>
        <Heading>1W</Heading>
        <TokenPriceChartProvider address={cellarAddress}>
          <TokenChart windowDate="1W" />
        </TokenPriceChartProvider>
        <Heading>1M</Heading>
        <TokenPriceChartProvider address={cellarAddress}>
          <TokenChart />
        </TokenPriceChartProvider>
        <Heading>1Y</Heading>
        <TokenPriceChartProvider address={cellarAddress}>
          <TokenChart windowDate="1Y" />
        </TokenPriceChartProvider>
        <Heading>1Y (Per week)</Heading>
        <TokenPriceChartProvider address={cellarAddress}>
          <TokenChart windowDate="1YperWeek" />
        </TokenPriceChartProvider>
      </Section>
    </Layout>
  )
}

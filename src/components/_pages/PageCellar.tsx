import { VFC } from "react"
import {
  Box,
  Heading,
  HeadingProps,
  HStack,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { PerformanceCard } from "components/_cards/PerformanceCard"
import { Section } from "components/_layout/Section"
import CellarDetailsCard from "components/_cards/CellarDetailsCard"
import { CellarStatsYield } from "components/CellarStatsYield"
import { BreadCrumb } from "components/BreadCrumb"
import { cellarDataMap } from "data/cellarDataMap"
import { CoinImage } from "components/_cards/CellarCard/CoinImage"
import { PerformanceChartByAddressProvider } from "data/context/performanceChartByAddressContext"
import { useTvm } from "data/hooks/useTvm"
import { useApy } from "data/hooks/useApy"
import { useCellarCap } from "data/hooks/useCellarCap"
import { useCurrentDeposits } from "data/hooks/useCurrentDeposits"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarPageProps } from "pages/strategies/[id]/manage"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useDailyChange } from "data/hooks/useDailyChange"
import { PercentageText } from "components/PercentageText"
import { CellarStatsAutomated } from "components/CellarStatsAutomated"
import { CellarType } from "data/types"
import { useIntervalGainPct } from "data/hooks/useIntervalGainPct"

const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "2xl",
  color: "neutral.300",
  pl: 8,
}

const PageCellar: VFC<CellarPageProps> = ({ id }) => {
  const cellarConfig = cellarDataMap[id].config
  const staticCellarData = cellarDataMap[id]
  const cellarAddress = cellarDataMap[id].config.id
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: dailyChange } = useDailyChange(cellarConfig)
  const intervalGainPct = useIntervalGainPct(cellarConfig)

  return (
    <Layout>
      <Section>
        <HStack
          spacing={4}
          pb={12}
          justify="space-between"
          align="flex-end"
          wrap="wrap"
          rowGap={4}
        >
          <VStack spacing={6} align="flex-start">
            <BreadCrumb cellarName={staticCellarData.name} id={id} />
            <HStack spacing={4}>
              <CoinImage />
              <Heading fontSize="2.5rem">
                {staticCellarData.name}{" "}
              </Heading>
            </HStack>
          </VStack>
          {staticCellarData.cellarType ===
            CellarType.yieldStrategies && (
            <CellarStatsYield
              tvm={tvm ? `${tvm.formatted}` : <Spinner />}
              apy={apyLoading ? <Spinner /> : apy?.expectedApy}
              apyTooltip={apy?.apyLabel}
              currentDeposits={currentDeposits?.value}
              cellarCap={cellarCap?.value}
              asset={activeAsset?.symbol}
              overrideApy={staticCellarData.overrideApy}
              cellarConfig={cellarConfig}
            />
          )}

          {staticCellarData.cellarType ===
            CellarType.automatedPortfolio && (
            <CellarStatsAutomated
              tokenPriceTooltip="The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for"
              tokenPriceLabel="Token price"
              tokenPriceValue={tokenPrice ?? <Spinner />}
              weekChangeTooltip="% change of current token price vs. token price yesterday"
              weekChangeLabel="1D Change"
              weekChangeValue={
                <>
                  {dailyChange ? (
                    <PercentageText
                      data={dailyChange}
                      headingSize="md"
                      arrow
                    />
                  ) : (
                    <Box>...</Box>
                  )}
                </>
              }
              monthChangeTooltip="% change of token price compared to a benchmark portfolio of 50% ETH and 50% BTC"
              monthChangeLabel="1M Change vs ETH/BTC 50/50"
              monthChangeValue={
                <>
                  {intervalGainPct.isLoading ? (
                    <Spinner />
                  ) : (
                    <PercentageText
                      data={intervalGainPct.data}
                      headingSize="md"
                    />
                  )}
                </>
              }
              cellarConfig={cellarConfig}
              currentDeposits={currentDeposits?.value}
              cellarCap={cellarCap?.value}
              asset={activeAsset?.symbol}
            />
          )}
        </HStack>
        <VStack spacing={4} align="stretch">
          <Heading {...h2Styles}>Your Portfolio</Heading>
          <PortfolioCard />
        </VStack>
      </Section>
      <Section>
        <VStack spacing={6} align="stretch">
          <Heading pt={12} {...h2Styles}>
            Strategy Details
          </Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
          <PerformanceChartByAddressProvider address={cellarAddress}>
            <Heading pt={12} {...h2Styles}>
              Cellar Performance
            </Heading>
            <PerformanceCard />
          </PerformanceChartByAddressProvider>
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

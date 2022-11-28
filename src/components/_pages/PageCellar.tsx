import { VFC } from "react"
import {
  Heading,
  HeadingProps,
  HStack,
  Spinner,
  useMediaQuery,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { PerformanceCard } from "components/_cards/PerformanceCard"
import { Section } from "components/_layout/Section"
import CellarDetailsCard from "components/_cards/CellarDetailsCard"
import { CellarStatsYield } from "components/CellarStatsYield"
import { BreadCrumb } from "components/BreadCrumb"
import { cellarDataMap } from "data/cellarDataMap"
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
import { useWeeklyIntervalGain } from "data/hooks/useWeeklyIntervalGain"
import {
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  isEthBtcChartEnabled,
  isTVMEnabled,
  isUsdcChartEnabled,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { EthBtcChartProvider } from "data/context/ethBtcChartContext"
import { EthBtcPerfomanceCard } from "components/_cards/EthBtcPerfomanceCard"
import { UsdcPerfomanceCard } from "components/_cards/UsdcPerfomanceCard"
import { UsdcChartProvider } from "data/context/usdcChartContext"
const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "2xl",
  color: "neutral.300",
  pl: { base: 6, sm: 8 },
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
  const intervalGainPct = useWeeklyIntervalGain(cellarConfig)
  const [isLarger768] = useMediaQuery("(min-width: 768px)")
  const isYieldStrategies =
    staticCellarData.cellarType === CellarType.yieldStrategies
  const isAutomatedPortfolio =
    staticCellarData.cellarType === CellarType.automatedPortfolio

  return (
    <Layout>
      <Section>
        <HStack
          pb={isLarger768 ? 12 : 0}
          justify="space-between"
          align="flex-end"
          wrap="wrap"
          rowGap={4}
        >
          <VStack spacing={6} align="flex-start">
            <BreadCrumb cellarName={staticCellarData.name} id={id} />
            <HStack spacing={4}>
              <Heading fontSize="2.5rem">
                {staticCellarData.name}{" "}
              </Heading>
            </HStack>
          </VStack>
          {isYieldStrategies && (
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

          {isAutomatedPortfolio && (
            <CellarStatsAutomated
              tokenPriceTooltip={tokenPriceTooltipContent(
                cellarConfig
              )}
              tokenPriceLabel="Token price"
              tokenPriceValue={tokenPrice ?? <Spinner />}
              weekChangeTooltip="% change of current token price vs. token price yesterday"
              weekChangeLabel="1D Change"
              weekChangeValue={
                <PercentageText
                  data={dailyChange}
                  headingSize="md"
                  arrow
                />
              }
              monthChangeTooltip={intervalGainPctTooltipContent(
                cellarConfig
              )}
              monthChangeLabel={intervalGainPctTitleContent(
                cellarConfig
              )}
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
        {isLarger768 && (
          <VStack spacing={4} align="stretch">
            <Heading {...h2Styles} pt={12}>
              Your Portfolio
            </Heading>
            <PortfolioCard />
          </VStack>
        )}
      </Section>
      <Section px={{ base: 0, md: 4 }}>
        <VStack spacing={6} align="stretch">
          {isEthBtcChartEnabled(cellarConfig) && (
            <EthBtcChartProvider address={cellarAddress}>
              <Heading pt={isLarger768 ? 12 : 0} {...h2Styles}>
                Strategy Perfomance
              </Heading>
              <EthBtcPerfomanceCard />
            </EthBtcChartProvider>
          )}
          {isUsdcChartEnabled(cellarConfig) && (
            <UsdcChartProvider address={cellarAddress}>
              <Heading pt={isLarger768 ? 12 : 0} {...h2Styles}>
                Strategy Perfomance
              </Heading>
              <UsdcPerfomanceCard />
            </UsdcChartProvider>
          )}
          <Heading pt={isYieldStrategies ? 0 : 12} {...h2Styles}>
            Strategy Details
          </Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
          {isTVMEnabled(cellarConfig) && (
            <PerformanceChartByAddressProvider
              address={cellarAddress}
            >
              <Heading pt={12} {...h2Styles}>
                Cellar Performance
              </Heading>
              <PerformanceCard />
            </PerformanceChartByAddressProvider>
          )}
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

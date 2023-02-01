import { VFC } from "react"
import {
  Heading,
  HeadingProps,
  HStack,
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
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarStatsAutomated } from "components/CellarStatsAutomated"
import { CellarNameKey, CellarType } from "data/types"
import {
  isEthBtcChartEnabled,
  isTVMEnabled,
  isUsdcChartEnabled,
} from "data/uiConfig"
import { EthBtcChartProvider } from "data/context/ethBtcChartContext"
import { EthBtcPerfomanceCard } from "components/_cards/EthBtcPerfomanceCard"
import { UsdcPerfomanceCard } from "components/_cards/UsdcPerfomanceCard"
import { UsdcChartProvider } from "data/context/usdcChartContext"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "2xl",
  color: "neutral.300",
  pl: { base: 6, sm: 8 },
}

export interface PageCellarProps {
  id: string
}

const PageCellar: VFC<PageCellarProps> = ({ id }) => {
  const cellarConfig = cellarDataMap[id].config
  const staticCellarData = cellarDataMap[id]
  const cellarAddress = cellarDataMap[id].config.id
  const isLarger768 = useBetterMediaQuery("(min-width: 768px)")
  const isYieldStrategies =
    staticCellarData.cellarType === CellarType.yieldStrategies
  const isAutomatedPortfolio =
    staticCellarData.cellarType === CellarType.automatedPortfolio

  // const notLaunched = isComingSoon(cellarDataMap[id].launchDate)
  const isRealYield =
    cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_USD

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
          {isYieldStrategies && <CellarStatsYield cellarId={id} />}

          {isAutomatedPortfolio && (
            <CellarStatsAutomated cellarConfig={cellarConfig} />
          )}
        </HStack>

        <VStack spacing={4} align="stretch">
          <Heading {...h2Styles} pt={12}>
            Your Portfolio
          </Heading>
          <PortfolioCard />
        </VStack>
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
          {isTVMEnabled(cellarConfig) && !isRealYield && (
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

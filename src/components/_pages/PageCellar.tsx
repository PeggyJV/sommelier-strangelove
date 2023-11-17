import { VFC } from "react"
import {
  Heading,
  HeadingProps,
  HStack,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/_layout/Layout"
import { Section } from "components/_layout/Section"
import CellarDetailsCard from "components/_cards/CellarDetailsCard"
import { CellarStatsYield } from "components/CellarStatsYield"
import { BreadCrumb } from "components/BreadCrumb"
import { cellarDataMap } from "data/cellarDataMap"
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarStatsAutomated } from "components/CellarStatsAutomated"
import { CellarNameKey, CellarType } from "data/types"
import {
  isApyChartEnabled,
  isEstimatedApyEnable,
  isTokenPriceChartEnabled,
} from "data/uiConfig"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { TokenPriceChartProvider } from "data/context/tokenPriceChartContext"
import { TokenPricePerfomanceCard } from "components/_cards/TokenPricePerfomaceCard"
import { ApyChartProvider } from "data/context/apyChartContext"
import { ApyPerfomanceCard } from "components/_cards/ApyPerfomanceCard"
import { isComingSoon } from "utils/isComingSoon"
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

  const notLaunched = isComingSoon(cellarDataMap[id].launchDate)
  const isRealYield =
    cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_USD ||
    cellarConfig.cellarNameKey === CellarNameKey.REAL_YIELD_ETH

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
          {!notLaunched &&
            isApyChartEnabled(cellarConfig) &&
            !isEstimatedApyEnable(cellarConfig) && (
              <ApyChartProvider address={cellarAddress} chain={cellarConfig.chain.id}>
                <Heading pt={isLarger768 ? 12 : 0} {...h2Styles}>
                  Vault Perfomance
                </Heading>
                <ApyPerfomanceCard />
              </ApyChartProvider>
            )}
          {isTokenPriceChartEnabled(cellarConfig) && (
            <TokenPriceChartProvider address={cellarAddress} chain={cellarConfig.chain.id}>
              <Heading pt={isLarger768 ? 12 : 0} {...h2Styles}>
                Vault Perfomance
              </Heading>
              <TokenPricePerfomanceCard />
            </TokenPriceChartProvider>
          )}

          <Heading pt={isYieldStrategies ? 0 : 12} {...h2Styles}>
            Vault Details
          </Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

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
import { CellarStats } from "components/CellarStats"
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
import { useWeekChange } from "data/hooks/useWeekChange"
import { PercentageText } from "components/PercentageText"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"

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
  const { data: weekChange } = useWeekChange(cellarConfig)
  const isAave = id === "AAVE"

  const cellarStatsData = {
    firstTooltip: isAave
      ? "Total value managed by Strategy"
      : "1 token price which is calculated based on current BTC, ETH, and USDC prices vs their proportions in strategy vs minted tokens in strategy",
    firstLabel: isAave ? "TVM" : "Token price",
    firstValue: isAave ? tvm?.formatted : tokenPrice,
    secondTooltip: isAave
      ? apy?.apyLabel
      : "% of current token price vs token price 1 W(7 days) ago",
    secondLabel: isAave ? "Expected APY" : "1W Change",
    secondValue: isAave ? (
      <Heading
        size="md"
        display="flex"
        alignItems="center"
        columnGap="3px"
      >
        {apyLoading ? <Spinner /> : apy?.expectedApy}
      </Heading>
    ) : (
      <>
        {weekChange ? (
          <PercentageText
            data={weekChange}
            positiveIcon={FaArrowUp}
            negativeIcon={FaArrowDown}
            headingSize="md"
          />
        ) : (
          <Box>...</Box>
        )}
      </>
    ),
  }

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
          <CellarStats
            firstTooltip={cellarStatsData.firstTooltip}
            firstLabel={cellarStatsData.firstLabel}
            firstValue={cellarStatsData.firstValue}
            secondTooltip={cellarStatsData.secondTooltip}
            secondLabel={cellarStatsData.secondLabel}
            secondValue={cellarStatsData.secondValue}
            currentDeposits={currentDeposits?.value}
            asset={activeAsset?.symbol}
            cellarConfig={cellarConfig}
            cellarCap={cellarCap?.value}
          />
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

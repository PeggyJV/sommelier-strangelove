import { VFC } from "react"
import {
  Box,
  Heading,
  HeadingProps,
  HStack,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { PerformanceCard } from "components/_cards/PerformanceCard"
import { Section } from "components/_layout/Section"
import { useConnect } from "wagmi"
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarPageProps } from "pages/cellars/[id]"
import { useGetCellarQuery } from "generated/subgraph"
import CellarDetailsCard from "components/_cards/CellarDetailsCard"
import { Link } from "components/Link"
import { CellarStats } from "components/CellarStats"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { formatCurrency } from "utils/formatCurrency"
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"
import { ArrowLeftIcon } from "components/_icons"
import { BreadCrumb } from "components/BreadCrumb"
import { cellarDataMap } from "data/cellarDataMap"
import { getCalulatedTvl } from "utils/bigNumber"
import { PerformanceChartProvider } from "context/performanceChartContext"
import BigNumber from "bignumber.js"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { useAaveStaker } from "context/aaveStakerContext"
import { tokenConfig } from "data/tokenConfig"
import { getCurrentAsset } from "utils/getCurrentAsset"

const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "2xl",
  color: "neutral.300",
  pl: 8,
}

const PageCellar: VFC<CellarPageProps> = ({ data: staticData }) => {
  const [auth] = useConnect()
  const isConnected = auth.data.connected
  const { cellar: staticCellar } = staticData
  const { cellarData, userData } = useAaveV2Cellar()
  const { userStakeData } = useAaveStaker()
  const { id, name } = staticCellar!
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: id,
      cellarString: id,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const {
    dayDatas,
    tvlTotal,
    liquidityLimit,
    addedLiquidityAllTime,
    removedLiquidityAllTime,
  } = cellar || {}
  const { activeAsset } = cellarData || {}

  const totalPortfolio = new BigNumber(
    userData?.balances?.aaveClr || 0
  ).plus(
    new BigNumber(userStakeData?.totalBondedAmount?.toString() || 0)
  )

  const calculatedTvl = tvlTotal && getCalulatedTvl(tvlTotal, 18)
  const tvmVal = formatCurrency(calculatedTvl)
  // const apy = data && averageApy(dayDatas!).toFixed(2)
  const currentDepositsVal = formatCurrentDeposits(
    addedLiquidityAllTime,
    removedLiquidityAllTime
  )
  const cellarCap =
    liquidityLimit &&
    new BigNumber(liquidityLimit).dividedBy(10 ** 6).toString()
  const { name: nameAbbreviated, cellarApy } = cellarDataMap[id]
  const activeSymbol =
    activeAsset && getCurrentAsset(tokenConfig, activeAsset)?.symbol

  // Staker Info
  const { stakerData } = useAaveStaker()
  const { potentialStakingApy } = stakerData

  let expectedApy = parseFloat(cellarApy)
  let apyLabel = "Expected APY"
  if (potentialStakingApy != null) {
    expectedApy = expectedApy + potentialStakingApy
    apyLabel = `Expected APY is calculated by combining the Base Cellar APY (${cellarApy}%) and Liquidity Mining Rewards (${potentialStakingApy.toFixed(
      1
    )}%)`
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
            <BreadCrumb cellarName={name} />
            <HStack spacing={4}>
              <Link href="/">
                <SecondaryButton>
                  <ArrowLeftIcon />
                </SecondaryButton>
              </Link>
              <Heading fontSize="2.5rem">
                {nameAbbreviated}{" "}
                <Box
                  as="span"
                  textTransform="uppercase"
                  fontSize="21px"
                  color="neutral.300"
                >
                  clr-s
                </Box>
              </Heading>
            </HStack>
          </VStack>
          <CellarStats
            tvm={`$${tvmVal} ${activeSymbol}`}
            apy={expectedApy.toFixed(1)}
            apyTooltip={apyLabel}
            currentDeposits={currentDepositsVal}
            cellarCap={cellarCap}
            asset={activeSymbol}
          />
        </HStack>
        <VStack spacing={4} align="stretch">
          <Heading {...h2Styles}>Your Portfolio</Heading>
          <PortfolioCard isConnected={isConnected} />
        </VStack>
      </Section>
      <Section>
        <VStack spacing={6} align="stretch">
          <Heading {...h2Styles}>Cellar Details</Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
          <PerformanceChartProvider>
            <PerformanceCard />
          </PerformanceChartProvider>
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

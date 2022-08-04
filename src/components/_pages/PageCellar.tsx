import { useEffect, useState, VFC } from "react"
import {
  Box,
  Heading,
  HeadingProps,
  HStack,
  Img,
  Text,
  Spinner,
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
import { CellarStats } from "components/CellarStats"
import { formatCurrency } from "utils/formatCurrency"
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"
import { BreadCrumb } from "components/BreadCrumb"
import { cellarDataMap } from "data/cellarDataMap"
import { getCalulatedTvl } from "utils/bigNumber"
import { PerformanceChartProvider } from "context/performanceChartContext"
import BigNumber from "bignumber.js"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"
import { useAaveStaker } from "context/aaveStakerContext"
import { tokenConfig } from "data/tokenConfig"
import { getCurrentAsset } from "utils/getCurrentAsset"
import { getExpectedApy } from "utils/cellarApy"

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
  const { cellarData, userData, aaveV2CellarContract } =
    useAaveV2Cellar()
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
    asset,
  } = cellar || {}
  const { activeAsset } = cellarData || {}
  const [cellarShareBalance, setCellarSharesBalance] =
    useState<BigNumber>(new BigNumber("0"))

  useEffect(() => {
    const fn = async () => {
      try {
        const cellarShareBalance =
          await aaveV2CellarContract.convertToAssets(
            new BigNumber(userData?.balances?.aaveClr || 0)
              .plus(userStakeData?.totalBondedAmount?.toString() || 0)
              .toFixed()
          )

        setCellarSharesBalance(cellarShareBalance)
      } catch (e) {
        console.warn("Error converting shares to assets", e)
      }
    }

    void fn()
  }, [
    aaveV2CellarContract,
    userData?.balances?.aAsset?.decimals,
    userData?.balances?.aaveClr,
    userStakeData?.totalBondedAmount,
  ])

  const calculatedTvl = tvlTotal && getCalulatedTvl(tvlTotal, 18)
  const tvmVal = formatCurrency(calculatedTvl)
  // const apy = data && averageApy(dayDatas!).toFixed(2)
  const currentDepositsVal = formatCurrentDeposits(
    addedLiquidityAllTime,
    removedLiquidityAllTime
  )
  const cellarCap =
    liquidityLimit &&
    new BigNumber(liquidityLimit)
      .dividedBy(10 ** (asset?.decimals || 0))
      .toString()
  const { name: nameAbbreviated } = cellarDataMap[id]
  const activeSymbol =
    activeAsset && getCurrentAsset(tokenConfig, activeAsset)?.symbol

  // Staker Info
  const { stakerData } = useAaveStaker()
  const {
    potentialStakingApy,
    loading: stakerDataLoading,
    error,
  } = stakerData

  const { expectedApy, formattedCellarApy, formattedStakingApy } =
    getExpectedApy(cellarData.apy, potentialStakingApy)

  const apyLabel = `Expected APY is calculated by combining the Base Cellar APY (${formattedCellarApy}%) and Liquidity Mining Rewards (${formattedStakingApy}%)`

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
              <Box
                display="flex"
                width="15rem"
                justifyContent="space-between"
                alignContent="center"
              >
                <Img
                  src="/assets/images/coin.png"
                  width="40px"
                  mb={3}
                />
                <Heading fontSize="2.5rem">
                  {nameAbbreviated}{" "}
                  <Text
                    as="span"
                    textTransform="uppercase"
                    fontSize="1.3rem"
                    color="neutral.300"
                  >
                    clr-s
                  </Text>
                </Heading>
              </Box>
            </HStack>
          </VStack>
          <CellarStats
            tvm={tvmVal ? `$${tvmVal} ${activeSymbol}` : <Spinner />}
            apy={
              stakerDataLoading || cellarData.loading ? (
                <Spinner />
              ) : (
                expectedApy.toFixed(1).toString() + "%"
              )
            }
            apyTooltip={apyLabel}
            currentDeposits={currentDepositsVal}
            cellarCap={cellarCap}
            asset={activeSymbol}
          />
        </HStack>
        <VStack spacing={4} align="stretch">
          <Heading {...h2Styles}>Your Portfolio</Heading>
          <PortfolioCard
            isConnected={isConnected}
            cellarShareBalance={cellarShareBalance}
          />
        </VStack>
      </Section>
      <Section>
        <VStack spacing={6} align="stretch">
          <Heading pt={12} {...h2Styles}>
            Cellar Details
          </Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
          <PerformanceChartProvider>
            <Heading pt={12} {...h2Styles}>
              Cellar Performance
            </Heading>
            <PerformanceCard />
          </PerformanceChartProvider>
        </VStack>
      </Section>
    </Layout>
  )
}

export default PageCellar

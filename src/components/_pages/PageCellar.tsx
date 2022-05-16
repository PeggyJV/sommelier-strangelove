import { VFC } from "react"
import { Box, Heading, HeadingProps, HStack, VStack } from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { PerformanceCard } from "components/_cards/PerformanceCard"
import { Section } from "components/_layout/Section"
import { useConnect } from "wagmi"
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarPageProps } from "pages/cellars/[id]"
import { useGetCellarQuery } from "generated/subgraph"
import StrategyBreakdownCard from "components/_cards/StrategyBreakdownCard"
import CellarDetailsCard from "components/_cards/CellarDetailsCard"
import { Link } from "components/Link"
import { CellarStats } from "components/CellarStats"
import { SecondaryButton } from "components/_buttons/SecondaryButton"
import { formatCurrency } from "utils/formatCurrency"
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"
import { ArrowLeftIcon } from "components/_icons"
import { BreadCrumb } from "components/BreadCrumb"
import BondingTableCard from "components/_cards/BondingTableCard"
import { cellarDataMap } from "data/cellarDataMap"
import { averageApy } from "utils/cellarApy"
import BigNumber from "bignumber.js"

const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "lg",
  color: "neutral.300",
}

const PageCellar: VFC<CellarPageProps> = ({ data: staticData }) => {
  const [auth] = useConnect()
  const isConnected = auth.data.connected
  const { cellar: staticCellar } = staticData
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
    asset,
    liquidityLimit,
    addedLiquidityAllTime,
    removedLiquidityAllTime,
  } = cellar || {}

  const calculatedTvl =
    tvlTotal &&
    asset &&
    new BigNumber(tvlTotal).dividedBy(10 ^ asset?.decimals).toString()

  const tvmVal = formatCurrency(calculatedTvl)
  const apy = data && averageApy(dayDatas!).toFixed(2)
  const currentDepositsVal = formatCurrentDeposits(
    addedLiquidityAllTime,
    removedLiquidityAllTime,
  )
  const { name: nameAbbreviated } = cellarDataMap[id]

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
                <Box as="span" textTransform="uppercase" fontSize="21px">
                  clr-s
                </Box>
              </Heading>
            </HStack>
          </VStack>
          <CellarStats
            tvm={`$${tvmVal} USDC`}
            apy={apy}
            currentDeposits={currentDepositsVal}
            cellarCap={liquidityLimit}
          />
        </HStack>
        <VStack spacing={4} align="stretch">
          <Heading {...h2Styles}>Your Portfolio</Heading>
          <PortfolioCard />
          {isConnected && <BondingTableCard />}
        </VStack>
      </Section>
      <Section>
        <VStack spacing={6} align="stretch">
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

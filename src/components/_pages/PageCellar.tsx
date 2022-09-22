import { VFC } from "react"
import {
  Box,
  Heading,
  HeadingProps,
  HStack,
  Text,
  Spinner,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { PerformanceCard } from "components/_cards/PerformanceCard"
import { Section } from "components/_layout/Section"
import { PortfolioCard } from "components/_cards/PortfolioCard"
import { CellarPageProps } from "pages/cellars/[id]"
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

const h2Styles: HeadingProps = {
  as: "h2",
  fontSize: "2xl",
  color: "neutral.300",
  pl: 8,
}

const PageCellar: VFC<CellarPageProps> = ({ data: staticData }) => {
  const { cellar: staticCellar } = staticData
  const { id } = staticCellar!

  const cellarConfig = cellarDataMap[id].config
  const staticCellarData = cellarDataMap[id]
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)

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
            <BreadCrumb cellarName={staticCellarData.name} />
            <HStack spacing={4}>
              <Box
                display="flex"
                width="15rem"
                justifyContent="space-between"
                alignContent="center"
              >
                <CoinImage mb={3} />
                <Heading fontSize="2.5rem">
                  {staticCellarData.name}{" "}
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
            tvm={tvm ? `${tvm.formatted}` : <Spinner />}
            apy={apyLoading ? <Spinner /> : apy?.expectedApy}
            apyTooltip={apy?.apyLabel}
            currentDeposits={currentDeposits?.value}
            cellarCap={cellarCap?.value}
            asset={activeAsset?.symbol}
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
            Cellar Details
          </Heading>
          <CellarDetailsCard
            cellarDataMap={cellarDataMap}
            cellarId={id}
          />
          <PerformanceChartByAddressProvider address={id}>
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

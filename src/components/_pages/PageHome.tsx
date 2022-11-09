import { NextPage } from "next"
import { Box, Flex, Heading, VStack } from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { CellarCard } from "components/_cards/CellarCard"
import { Section } from "components/_layout/Section"
import { GridHome } from "components/GridHome"
import {
  CellarCardDisplay,
  CellarCardData,
} from "components/_cards/CellarCard/CellarCardDisplay"
import { Link } from "components/Link"
import { HomeProps } from "pages/index"
import FAQ from "components/FAQ"
import { cellarDataMap } from "data/cellarDataMap"
import { CellarType } from "data/types"
import { config } from "utils/config"
import { analytics } from "utils/analytics"
import { landingType } from "utils/landingType"

interface CellarGridItemsType {
  section: CellarType
}

const PageHome: NextPage<HomeProps> = ({ faqData }) => {
  const CellarGridItems = ({ section }: CellarGridItemsType) => {
    const filteredCellars = Object.values(cellarDataMap).filter(
      (v) => v.cellarType === section
    )

    const cellars = filteredCellars.map((v) => {
      return Object.values(config.CONTRACT).find(
        (item) => item.ADDRESS === v.config.id
        // @ts-ignore use ts-ignore because we don't have type for config
      )?.SLUG
    })

    const totalCellars = cellars.length ?? 0
    const numPlaceholderCards = 3 - totalCellars
    const placeholderCardsArray = Array.from(
      Array(numPlaceholderCards).keys()
    )
    return (
      <>
        {cellars.map((cellar) => {
          return (
            <Link
              href={`/strategies/${cellar}`}
              key={cellar}
              display="flex"
              borderRadius={28}
              onClick={() => {
                analytics.track("strategy.selection", {
                  strategyCard: cellarDataMap[cellar].name,
                  landingType: landingType(),
                })
              }}
            >
              <CellarCard cellarAddress={cellar} as="li" />
            </Link>
          )
        })}
        {placeholderCardsArray.map((index) => {
          const cellarCardData: CellarCardData = {
            cellarId: "",
            name: "...",
            description: "",
            strategyType: "...",
            managementFee: "...",
            protocols: "...",
          }
          return (
            <CellarCardDisplay
              key={index}
              data={cellarCardData}
              as="li"
              isPlaceholder
              index={index}
            />
          )
        })}
      </>
    )
  }

  return (
    <Layout>
      <VStack spacing={6} align="flex-start">
        <Section w="100%">
          <Flex
            w="100%"
            direction="column"
            align={{ base: "center", md: "initial" }}
          >
            <Box mb={12}>
              <Heading>Automated Portfolio Management</Heading>
            </Box>
            <GridHome>
              <CellarGridItems
                section={CellarType.automatedPortfolio}
              />
            </GridHome>
          </Flex>
        </Section>
        <Section w="100%">
          <Flex
            w="100%"
            direction="column"
            align={{ base: "center", md: "initial" }}
          >
            <Box mb={12}>
              <Heading>Yield Strategies</Heading>
            </Box>
            <GridHome>
              <CellarGridItems section={CellarType.yieldStrategies} />
            </GridHome>
          </Flex>
        </Section>
      </VStack>
      <FAQ data={faqData.faqTabs} />
    </Layout>
  )
}

export default PageHome

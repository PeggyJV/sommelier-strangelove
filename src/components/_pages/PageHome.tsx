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
import { CellarHomeDataMap } from "data/CellarHomeDataMap"

interface CellarGridItemsType {
  section: "automatedPortofolio" | "yieldStrategies"
}

const PageHome: NextPage<HomeProps> = ({ faqData }) => {
  const CellarGridItems = ({ section }: CellarGridItemsType) => {
    const cellars = Object.keys(CellarHomeDataMap[section])
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
              <CellarGridItems section="automatedPortofolio" />
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
              <CellarGridItems section="yieldStrategies" />
            </GridHome>
          </Flex>
        </Section>
      </VStack>
      <FAQ data={faqData.faqTabs} />
    </Layout>
  )
}

export default PageHome

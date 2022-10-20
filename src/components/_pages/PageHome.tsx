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
import { cellarDataMap } from "data/cellarDataMap"
import { HomeProps } from "pages/index"
import FAQ from "components/FAQ"

const PageHome: NextPage<HomeProps> = ({ faqData }) => {
  const cellars = Object.keys(cellarDataMap)
  const totalCellars = cellars.length ?? 0
  const numPlaceholderCards = 3 - totalCellars
  const placeholderCardsArray = Array.from(
    Array(numPlaceholderCards).keys()
  )

  const CellarGridItems = () => {
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
              <Heading>Cellars</Heading>
            </Box>
            <GridHome>
              <CellarGridItems />
            </GridHome>
          </Flex>
        </Section>
      </VStack>
      <FAQ data={faqData.faqTabs} />
    </Layout>
  )
}

export default PageHome

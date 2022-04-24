import { NextPage } from "next"
import { Box, Flex, Heading, Spinner, VStack } from "@chakra-ui/react"
import { Layout } from "components/Layout"
import {
  CellarCard,
  CellarCardData,
} from "components/_cards/CellarCard"
import { useConnect } from "wagmi"
import { Section } from "components/_layout/Section"
import { useGetAllCellarsQuery } from "generated/subgraph"
import { Education } from "components/Education"
import { GridHome } from "components/GridHome"
import { CellarCardDisplay } from "components/_cards/CellarCard/CellarCardDisplay"

const PageHome: NextPage = () => {
  const [auth] = useConnect()
  const [cellarsResult] = useGetAllCellarsQuery()
  const { data, fetching } = cellarsResult
  const totalCellars = data?.cellars?.length ?? 0
  const numPlaceholderCards = 3 - totalCellars
  const placeholderCardsArray = Array.from(
    Array(numPlaceholderCards).keys()
  )

  const CellarGridItems = () => {
    if (fetching) {
      return <Spinner />
    }
    return (
      <>
        {data?.cellars.map((cellar) => {
          return (
            <CellarCard
              key={cellar.id}
              cellarAddress={cellar.id}
              as="li"
            />
          )
        })}
        {placeholderCardsArray.map((index) => {
          const cellarCardData: CellarCardData = {
            name: "-",
            strategyType: "-",
            managementFee: "-",
            protocols: "-",
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
          <Flex w="100%" direction="column">
            <Box mb={12}>
              <Heading>Cellars</Heading>
            </Box>
            <GridHome>
              <CellarGridItems />
            </GridHome>
          </Flex>
        </Section>
      </VStack>
      <Education />
    </Layout>
  )
}

export default PageHome

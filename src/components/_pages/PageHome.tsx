import { NextPage } from "next"
import {
  Box,
  Flex,
  Grid,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { CellarCard } from "components/_cards/CellarCard"
import { useConnect } from "wagmi"
import { Section } from "components/_layout/Section"
import { Cellar, useGetAllCellarsQuery } from "generated/subgraph"
import { Education } from "components/Education"
import { GridHome } from "components/GridHome"

const PageHome: NextPage = () => {
  const [auth] = useConnect()
  const [cellarsResult] = useGetAllCellarsQuery()
  const { data } = cellarsResult
  const totalCellars = data?.cellars?.length ?? 0
  const numPlaceholderCards = 3 - totalCellars
  const placeholderCardsArray = Array.from(
    Array(numPlaceholderCards).keys()
  )

  const isConnected = auth.data.connected

  return (
    <Layout>
      <VStack spacing={6} align="flex-start">
        <Section w="100%">
          <Flex w="100%" direction="column">
            <Box mb={12}>
              <Heading>Cellars</Heading>
            </Box>
            <GridHome>
              {data?.cellars.map((cellar) => {
                return (
                  <CellarCard key={cellar.id} data={cellar} as="li" />
                )
              })}
              {placeholderCardsArray.map((index) => {
                return <CellarCard key={index} as="li" />
              })}
            </GridHome>
          </Flex>
        </Section>
      </VStack>
      <Education />
    </Layout>
  )
}

export default PageHome

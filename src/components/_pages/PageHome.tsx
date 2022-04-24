import { NextPage } from "next"
import { Box, Flex, Heading, VStack } from "@chakra-ui/react"
import { Layout } from "components/Layout"
import {
  CellarCard,
  CellarCardData,
} from "components/_cards/CellarCard"
import { useConnect } from "wagmi"
import { Section } from "components/_layout/Section"
import { Cellar, useGetAllCellarsQuery } from "generated/subgraph"
import { Education } from "components/Education"
import { GridHome } from "components/GridHome"

interface CellarDataMap {
  [key: string]: string
}

const cellarNameMap: CellarDataMap = {
  "0xc3761EB917CD790B30dAD99f6Cc5b4Ff93C4F9eA": "aave2",
}

const PageHome: NextPage = () => {
  const [auth] = useConnect()
  const [cellarsResult] = useGetAllCellarsQuery()
  const { data } = cellarsResult
  const totalCellars = data?.cellars?.length ?? 0
  const numPlaceholderCards = 3 - totalCellars
  const placeholderCardsArray = Array.from(
    Array(numPlaceholderCards).keys()
  )

  console.log("data", data)

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
                const cellarCardData: CellarCardData = {
                  name: cellarNameMap[cellar.id],
                  tvm: "",
                  coinType: "Stable",
                  percent: "5%",
                  symbol: "AAVE",
                }
                return (
                  <CellarCard
                    key={cellar.id}
                    data={cellarCardData}
                    as="li"
                  />
                )
              })}
              {placeholderCardsArray.map((index) => {
                const cellarCardData: CellarCardData = {
                  name: "-",
                  coinType: "-",
                  percent: "-",
                  symbol: "-",
                }
                return (
                  <CellarCard
                    key={index}
                    data={cellarCardData}
                    as="li"
                    isPlaceholder
                    index={index}
                  />
                )
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

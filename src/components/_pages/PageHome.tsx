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
import { CellarOverviewCard } from "components/_cards/CellarOverviewCard"
import { useConnect } from "wagmi"
import { Section } from "components/_layout/Section"
import { Cellar, useGetAllCellarsQuery } from "generated/subgraph"
import { Education } from "components/Education"

const PageHome: NextPage = () => {
  const [auth] = useConnect()
  const [cellarsResult] = useGetAllCellarsQuery()
  const { data } = cellarsResult

  const isConnected = auth.data.connected

  return (
    <Layout>
      <VStack spacing={6} align="flex-start">
        <Section>
          <Flex w="100%" direction="column">
            <Box mb={12}>
              <Heading>Cellars</Heading>
            </Box>
            <Grid gap={6} templateColumns="1fr 1fr 1fr">
              {data?.cellars.map((cellar) => {
                const { id, name, dayDatas, numWalletsActive } =
                  cellar as Cellar

                return (
                  <CellarOverviewCard
                    key={id}
                    id={id}
                    isConnected={isConnected}
                    name={name}
                    dayDatas={dayDatas}
                    numWalletsActive={numWalletsActive}
                  />
                )
              })}
            </Grid>
          </Flex>
        </Section>
      </VStack>
      <Education />
    </Layout>
  )
}

export default PageHome

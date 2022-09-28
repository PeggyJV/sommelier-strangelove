import { NextPage } from "next"
import { Box, Flex, Heading, Spinner, VStack } from "@chakra-ui/react"
import { Layout } from "components/Layout"
import { CellarCard } from "components/_cards/CellarCard"
import { Section } from "components/_layout/Section"
import { useGetAllCellarsQuery } from "generated/subgraph"
import { Education } from "components/Education"
import { GridHome } from "components/GridHome"
import {
  CellarCardDisplay,
  CellarCardData,
} from "components/_cards/CellarCard/CellarCardDisplay"
import { Link } from "components/Link"

const PageHome: NextPage = () => {
  const [cellarsResult] = useGetAllCellarsQuery()
  // const { cellarData, userData, aaveCellarSigner } = useAaveV2Cellar()
  // console.log({ cellarData, userData, aaveCellarSigner })

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
            <Link
              href={`/cellars/${cellar.id}`}
              key={cellar.id}
              display="flex"
              borderRadius={28}
            >
              <CellarCard cellarAddress={cellar.id} as="li" />
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
      <Education />
    </Layout>
  )
}

export default PageHome

import { Button, Center, Heading, HStack } from "@chakra-ui/react"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { ErrorCard } from "components/_cards/ErrorCard"
import { StrategyDesktopColumn } from "components/_columns/StrategyDesktopColumn"
import { StrategyMobileColumn } from "components/_columns/StrategyMobileColumn"
import { StrategyTabColumn } from "components/_columns/StrategyTabColumn"
import { Layout } from "components/_layout/Layout"
import { TransparentSkeleton } from "components/_skeleton"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import {
  GetAllStrategiesDataDocument,
  GetAllStrategiesDataQuery,
  GetAllStrategiesDataQueryVariables,
} from "generated/subgraph"
import { initUrqlClient } from "context/urql/initUrqlClient"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import type { GetServerSideProps, NextPage } from "next"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { useMemo, useState } from "react"
import { reactQueryConfig } from "utils/reactQueryConfig"

const Home: NextPage = () => {
  const {
    data,
    isLoading,
    isError,
    refetch,
    isFetching,
    isRefetching,
  } = useAllStrategiesData()
  const isMobile = useBetterMediaQuery("(max-width: 767px)")
  const isTab = useBetterMediaQuery("(max-width: 1023px)")
  const isDesktop = !isTab && !isMobile
  const [type, setType] = useState<string>("All")
  const strategyType = ["All", "Portofolio", "Yield"]
  const columns = isDesktop
    ? StrategyDesktopColumn
    : isTab && !isMobile
    ? StrategyTabColumn
    : StrategyMobileColumn

  const strategyData = useMemo(() => {
    if (type === "Yield") {
      return data?.filter(({ type }) => type === 0) || []
    }
    if (type === "Portofolio") {
      return data?.filter(({ type }) => type === 1) || []
    }
    return data || []
  }, [data, type])

  const loading = isFetching || isRefetching || isLoading

  return (
    <Layout>
      <HStack mb="1.6rem" justifyContent="space-between">
        <Heading fontSize="1.3125rem">Strategies</Heading>
        <HStack spacing="8px">
          {strategyType.map((strategy: string, i: number) => {
            const isSelected = strategy === type
            return (
              <Button
                key={i}
                variant="unstyled"
                color="white"
                fontWeight={600}
                fontSize="1rem"
                p={4}
                py={1}
                rounded="100px"
                bg={isSelected ? "surface.primary" : "none"}
                backdropFilter="blur(8px)"
                borderColor={
                  isSelected ? "purple.dark" : "surface.tertiary"
                }
                borderWidth={isSelected ? 1 : 0}
                onClick={() => {
                  setType(strategy)
                }}
              >
                {strategy}
              </Button>
            )
          })}
        </HStack>
      </HStack>
      <TransparentSkeleton
        height={loading ? "400px" : "auto"}
        w="full"
        borderRadius={20}
        isLoaded={!loading}
      >
        {isError ? (
          <ErrorCard message="" py="100px">
            <Center>
              <Button
                w="100px"
                variant="outline"
                onClick={() => refetch()}
              >
                Retry
              </Button>
            </Center>
          </ErrorCard>
        ) : (
          <StrategyTable columns={columns} data={strategyData} />
        )}
      </TransparentSkeleton>
    </Layout>
  )
}
export const getServerSideProps: GetServerSideProps = async () => {
  const url = process.env.NEXT_PUBLIC_GRAPH_ENDPOINT!
  const { ssrCache, urqlClient } = initUrqlClient(url)

  await urqlClient
    .query<
      GetAllStrategiesDataQuery,
      GetAllStrategiesDataQueryVariables
    >(GetAllStrategiesDataDocument)
    .toPromise()

  const queryClient = new QueryClient(reactQueryConfig)
  await queryClient.fetchQuery(
    ["USE_COIN_GECKO_PRICE", "sommelier"],
    async () => await fetchCoingeckoPrice("sommelier", "usd")
  )
  // prefetch and cache the data
  return {
    props: {
      URQL_DATA: ssrCache?.extractData(),
      dehydratedState: dehydrate(queryClient),
    },
  }
}

export default Home

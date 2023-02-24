import { dehydrate, QueryClient } from "@tanstack/react-query"
import {
  GetAllStrategiesDataDocument,
  GetAllStrategiesDataQuery,
  GetAllStrategiesDataQueryVariables,
} from "generated/subgraph"
import { initUrqlClient } from "context/urql/initUrqlClient"
import type { GetServerSideProps, NextPage } from "next"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { reactQueryConfig } from "utils/reactQueryConfig"
import { PageHome } from "components/_pages/PageHome"

const Home: NextPage = () => {
  return <PageHome />
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

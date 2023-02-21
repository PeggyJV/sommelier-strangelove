import { Heading, useMediaQuery } from "@chakra-ui/react"
import { StrategyDesktopColumn } from "components/_columns/StrategyDesktopColumn"
import { StrategyMobileColumn } from "components/_columns/StrategyMobileColumn"
import { Layout } from "components/_layout/Layout"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import type { NextPage } from "next"

const Home: NextPage = () => {
  const { data } = useAllStrategiesData()
  const [isLargerThan768] = useMediaQuery("(min-width: 768px)")

  const columns = isLargerThan768
    ? StrategyDesktopColumn
    : StrategyMobileColumn

  return (
    <Layout>
      <Heading fontSize="1.3125rem" mb="1.6rem">
        Strategies
      </Heading>
      {data ? (
        <StrategyTable columns={columns} data={data} />
      ) : (
        "loading..."
      )}
    </Layout>
  )
}

export default Home

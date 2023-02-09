import { Layout } from "components/_layout/Layout"
import { StrategyTable } from "components/_tables/StrategyTable"
import type { NextPage } from "next"

const Home: NextPage = () => {
  return (
    <Layout>
      <StrategyTable />
    </Layout>
  )
}

export default Home

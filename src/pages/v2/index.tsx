import { Layout } from "components/_layout/Layout"
import { StrategyTable } from "components/_tables/StrategyTable"
import type { NextPage } from "next"

const Home: NextPage = () => {
  const strategies = [
    {
      title: "Real Yield USD",
      type: "Yield",
      provider: "Seven Seas",
      launchDate: new Date("2023-01-25T00:00:00.000Z"),
      protocols: ["AAVE", "Compound", "Uniswap V3"],
      strategyAssets: ["USDC", "USDT", "DAI"],
      tvm: "$1.99M",
      baseApy: "20%",
      oneDay: 0.03,
      icon: "/assets/icons/real-yield-usd.png",
    },
    {
      title: "Steady UNI",
      type: "Portofolio",
      provider: "Patache",
      launchDate: new Date(2022, 11, 29, 11, 0, 0, 0),
      protocols: ["Uniswap V3"],
      strategyAssets: ["USDC", "UNI"],
      tvm: "$1.99M",
      baseApy: "20%",
      oneDay: 0.01,
      icon: "/assets/icons/steady-uni.png",
    },
  ]
  return (
    <Layout>
      <StrategyTable strategies={strategies} />
    </Layout>
  )
}

export default Home

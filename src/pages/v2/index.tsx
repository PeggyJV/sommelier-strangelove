import { Button, Heading, HStack } from "@chakra-ui/react"
import { StrategyDesktopColumn } from "components/_columns/StrategyDesktopColumn"
import { StrategyMobileColumn } from "components/_columns/StrategyMobileColumn"
import { StrategyTabColumn } from "components/_columns/StrategyTabColumn"
import { Layout } from "components/_layout/Layout"
import { StrategyTable } from "components/_tables/StrategyTable"
import { AllStrategiesData } from "data/actions/types"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import type { NextPage } from "next"
import { useMemo, useState } from "react"

const Home: NextPage = () => {
  const { data } = useAllStrategiesData()
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
      return data?.filter(({ type }) => type === 0)
    }
    if (type === "Portofolio") {
      return data?.filter(({ type }) => type === 1)
    }
    return data
  }, [data, type])

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
      {data ? (
        <StrategyTable
          columns={columns}
          data={strategyData as AllStrategiesData}
        />
      ) : (
        "loading..."
      )}
    </Layout>
  )
}

export default Home

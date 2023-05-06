import { Button, Center, Heading, HStack } from "@chakra-ui/react"
import { ErrorCard } from "components/_cards/ErrorCard"
import { StrategyDesktopColumn } from "components/_columns/StrategyDesktopColumn"
import { StrategyMobileColumn } from "components/_columns/StrategyMobileColumn"
import { StrategyTabColumn } from "components/_columns/StrategyTabColumn"
import { LayoutWithSidebar } from "components/_layout/LayoutWithSidebar"
import { TransparentSkeleton } from "components/_skeleton"
import { StrategyTable } from "components/_tables/StrategyTable"
import { useHome } from "data/context/homeContext"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import { CellarType } from "data/types"
import useBetterMediaQuery from "hooks/utils/useBetterMediaQuery"
import { useMemo, useState } from "react"

export const PageHome = () => {
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
  const strategyType = ["All", "Portfolio", "Yield"]

  const { timeline } = useHome()
  const columns = isDesktop
    ? StrategyDesktopColumn({ timeline })
    : isTab && !isMobile
    ? StrategyTabColumn({ timeline })
    : StrategyMobileColumn({ timeline })

  const strategyData = useMemo(() => {
    if (type === "Yield") {
      return (
        data?.filter(
          (item) => item?.type === CellarType.yieldStrategies
        ) || []
      )
    }
    if (type === "Portfolio") {
      return (
        data?.filter(
          (item) => item?.type === CellarType.automatedPortfolio
        ) || []
      )
    }
    return data || []
  }, [data, type])

  const loading = isFetching || isRefetching || isLoading

  return (
    <LayoutWithSidebar>
      <HStack mb="1.6rem" justifyContent="space-between">
        <Heading fontSize="1.3125rem">All strategies</Heading>
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
          <>
            <StrategyTable columns={columns} data={strategyData} />
          </>
        )}
      </TransparentSkeleton>
    </LayoutWithSidebar>
  )
}

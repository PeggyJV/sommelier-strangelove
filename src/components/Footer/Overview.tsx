import { Stack, Text, VStack } from "@chakra-ui/react"
import { TransparentCard } from "components/_cards/TransparentCard"
import { LighterSkeleton } from "components/_skeleton"
import { formatUSD } from "utils/formatCurrency"
import { fetchTVLData } from "queries/get-all-tvl"
import { useEffect, useState } from "react"
import { GetTVLDataQuery } from "src/data/actions/types"
import { cellarDataMap } from "src/data/cellarDataMap"

export const Overview = () => {
  const [tvlData, setTotalTVL] = useState<GetTVLDataQuery | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoadingTVL] = useState(false) // Added isLoadingTVL state

  useEffect(() => {
    setIsLoadingTVL(true) // Set loading state to true before fetching data
    fetchTVLData()
      .then((response) => {
        setTotalTVL(response)
      })
      .catch((error) => {
        console.log("Error from fetchTVLData", error) // Log errors
        setError(error)
      })
      .finally(() => {
        setIsLoadingTVL(false) // Reset loading state in either case (success/failure)
      })
  }, [])

  const totalTVM: Number = tvlData?.total_tvl ?? 0

  // Just length of map cellarDataMap
  const totalLaunchedStrategies = Object.keys(cellarDataMap).length

  return (
    <TransparentCard marginTop="48px" py="30px">
      <Stack
        flexDir={{ base: "column", md: "row" }}
        justifyContent="space-around"
        alignItems="center"
        gap={{ base: 8, md: 4 }}
      >
        <VStack spacing="8px">
          <Text fontSize="16px" fontWeight="bold">
            TVL
          </Text>
          <LighterSkeleton
            isLoaded={!isLoading}
            width={isLoading ? "100px" : "auto"}
            height={isLoading ? "60px" : "auto"}
          >
            <Text fontWeight="bold" fontSize="40px">
              {formatUSD(String(totalTVM))}
            </Text>
          </LighterSkeleton>
        </VStack>
        <VStack spacing="8px">
          <Text fontSize="16px" fontWeight="bold">
            Total Vaults
          </Text>
          <LighterSkeleton
            isLoaded={!isLoading}
            width={isLoading ? "100px" : "auto"}
            height={isLoading ? "60px" : "auto"}
          >
            <Text fontWeight="bold" fontSize="40px">
              {String(totalLaunchedStrategies)}
            </Text>
          </LighterSkeleton>
        </VStack>
      </Stack>
    </TransparentCard>
  )
}

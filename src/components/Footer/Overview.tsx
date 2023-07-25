import { Stack, Text, VStack } from "@chakra-ui/react"
import { TransparentCard } from "components/_cards/TransparentCard"
import { LighterSkeleton } from "components/_skeleton"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import { formatUSD } from "utils/formatCurrency"
import { isComingSoon } from "utils/isComingSoon"

export const Overview = () => {
  const { data, isLoading } = useAllStrategiesData()

  const totalTVM = data?.reduce((acc, item) => {
    if (item && item.tvm && item.tvm.value) {
      return acc + Number(item.tvm.value)
    }
    return acc
  }, 0)

  const totalLaunchedStrategies = data?.filter((item) => {
    const hideValue =
      isComingSoon(item?.launchDate) &&
      process.env.NEXT_PUBLIC_SHOW_ALL_MANAGE_PAGE === "false"
    return !hideValue
  })

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
              {String(
                totalLaunchedStrategies?.filter((strategies) =>
                  strategies?.launchDate
                    ? strategies?.launchDate <= new Date()
                    : true
                ).length
              )}
            </Text>
          </LighterSkeleton>
        </VStack>
      </Stack>
    </TransparentCard>
  )
}

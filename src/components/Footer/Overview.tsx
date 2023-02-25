import { Stack, Text, VStack } from "@chakra-ui/react"
import { TransparentCard } from "components/_cards/TransparentCard"
import { LighterSkeleton } from "components/_skeleton"
import { useAllStrategiesData } from "data/hooks/useAllStrategiesData"
import { formatUSD } from "utils/formatCurrency"

export const Overview = () => {
  const { data, isLoading } = useAllStrategiesData()

  const totalTVM = data?.reduce((acc, item) => {
    return acc + Number(item?.tvm.value)
  }, 0)

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
            TVM
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
            Total Strategies
          </Text>
          <LighterSkeleton
            isLoaded={!isLoading}
            width={isLoading ? "100px" : "auto"}
            height={isLoading ? "60px" : "auto"}
          >
            <Text fontWeight="bold" fontSize="40px">
              {String(data?.length)}
            </Text>
          </LighterSkeleton>
        </VStack>
      </Stack>
    </TransparentCard>
  )
}

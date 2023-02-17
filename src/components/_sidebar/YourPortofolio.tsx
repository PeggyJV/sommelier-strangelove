import { HStack, Image, Stack, Text, VStack } from "@chakra-ui/react"
import { CardBase } from "components/Cellars/CardBase"
import { LighterSkeleton } from "components/_skeleton"
import { useUserData } from "data/hooks/useUserData"

export const YourPortofolio = () => {
  const { data, isLoading } = useUserData()
  return (
    <VStack spacing="32px" w="full">
      <VStack w="full" spacing="9.5px">
        <VStack spacing="16px" w="full">
          <Text textAlign="center" fontWeight="bold" fontSize="21px">
            Your Portfolio
          </Text>
          <LighterSkeleton
            isLoaded={!isLoading}
            h={isLoading ? "60px" : "auto"}
            w={isLoading ? "75%" : "auto"}
          >
            <Text
              textAlign="center"
              fontWeight="bold"
              fontSize="48px"
            >
              {data?.totalNetValue.formatted}
            </Text>
          </LighterSkeleton>
        </VStack>
        <LighterSkeleton
          isLoaded={!isLoading}
          h={isLoading ? "24px" : "auto"}
          w={isLoading ? "40%" : "auto"}
        >
          <HStack spacing="8px">
            <Image
              src="/assets/icons/rewards.svg"
              alt="somm rewards icon"
              h="24px"
              w="24px"
            />
            <Text
              fontWeight="semibold"
              fontSize="16px"
              color="neutral.400"
            >
              {data?.totalSommRewards.value === 0
                ? "0.00"
                : data?.totalSommRewards.formatted}{" "}
              SOMM
            </Text>
          </HStack>
        </LighterSkeleton>
      </VStack>
      {Number(data?.totalNetValue?.value) <= 0 && (
        <CardBase w="full">
          <Stack>
            <Text fontWeight="bold" fontSize="16px">
              Select a strategy to start earning
            </Text>
            <Text
              fontWeight="semibold"
              fontSize="12px"
              color="neutral.400"
            >
              Start earning with smart automatic strategies on the
              Sommelier marketplace
            </Text>
          </Stack>
        </CardBase>
      )}
    </VStack>
  )
}

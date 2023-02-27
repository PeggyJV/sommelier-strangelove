import {
  Button,
  Center,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { CardBase } from "components/_cards/CardBase"
import { ErrorCard } from "components/_cards/ErrorCard"
import { SidebarColumn } from "components/_columns/SidebarColumn"
import {
  LighterSkeleton,
  TransparentSkeleton,
} from "components/_skeleton"
import { SidebarTable } from "components/_tables/SidebarTable"
import { useUserDataAllStrategies } from "data/hooks/useUserDataAllStrategies"

export const YourPortofolio = () => {
  const { data, isLoading, refetch } = useUserDataAllStrategies()
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
        <TransparentSkeleton
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
        </TransparentSkeleton>
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

      <TransparentSkeleton
        height={isLoading ? "400px" : "auto"}
        w="full"
        borderRadius={20}
        isLoaded={!isLoading}
      >
        {!data ? (
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
          <SidebarTable
            columns={SidebarColumn}
            data={data?.strategies}
          />
        )}
      </TransparentSkeleton>
    </VStack>
  )
}

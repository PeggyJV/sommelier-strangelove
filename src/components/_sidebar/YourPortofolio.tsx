import {
  Box,
  Button,
  Center,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react"
import { ErrorCard } from "components/_cards/ErrorCard"
import { TransparentCard } from "components/_cards/TransparentCard"
import { LogoIcon } from "components/_icons"
import { LighterSkeleton } from "components/_skeleton"
import { useUserDataAllStrategies } from "data/hooks/useUserDataAllStrategies"
import { PortofolioItem } from "./PortofolioItem"

export const YourPortofolio = () => {
  const { data, isLoading, isError, refetch } =
    useUserDataAllStrategies()
  const valueAndFormatted = ({
    value,
    formatted,
  }: {
    value?: number | string
    formatted?: string
  }) => {
    return {
      value: value ?? 0,
      formatted: formatted ?? "0",
    }
  }

  return (
    <VStack spacing="32px" w="full" mt={16}>
      <TransparentCard
        fontFamily="Haffer"
        w="100%"
        paddingX={0}
        pt={3}
      >
        <VStack alignItems="flex-start" w="100%" spacing={0}>
          <Text
            marginX="auto"
            fontWeight={600}
            fontSize="16px"
            mt={3}
          >
            Your total balance
          </Text>
          <LighterSkeleton
            isLoaded={!isLoading}
            h={isLoading ? "60px" : "auto"}
            m="auto"
            w="full"
          >
            <Text
              as="h3"
              fontWeight={700}
              fontSize="40px"
              w="full"
              textAlign="center"
              mb="10px"
            >
              {data?.totalNetValue.formatted}
            </Text>
          </LighterSkeleton>
          <Box
            py="19px"
            px={8}
            w="100%"
            borderTop="1px solid"
            borderBottom="1px solid"
            borderColor="surface.secondary"
          >
            <Text fontSize={12} fontWeight={600} color="neutral.400">
              Vault
            </Text>
          </Box>
          <LighterSkeleton
            isLoaded={!isLoading}
            h={isLoading ? "300px" : "auto"}
            m="auto"
            w="full"
          >
            <Box w="100%">
              {!isError && data ? (
                data.strategies.map((strategy) => (
                  strategy.userStrategyData.strategyData?.slug &&
                  <PortofolioItem
                    symbol={
                      strategy.userStrategyData.userData.symbol || ""
                    }
                    bondedToken={Number(
                      strategy?.userStakes?.totalBondedAmount.value ??
                        0
                    )}
                    key={strategy.userStrategyData.strategyData?.name}
                    icon={
                      strategy.userStrategyData.strategyData?.logo ??
                      ""
                    }
                    title={
                      strategy.userStrategyData.strategyData?.name ??
                      ""
                    }
                    netValueUsd={
                      strategy.userStrategyData.userData
                        ?.valueWithoutRewards.formatted ?? ""
                    }
                    netValueInAsset={
                      strategy.userStrategyData.userData
                        ?.netValueWithoutRewardsInAsset.value ?? 0
                    }
                    tokenPrice={valueAndFormatted({
                      value:
                        strategy.userStrategyData.strategyData?.token
                          ?.value,
                      formatted:
                        strategy.userStrategyData.strategyData?.token
                          ?.formatted,
                    })}
                    slug={
                      strategy.userStrategyData.strategyData?.slug ??
                      ""
                    }
                    description={
                      strategy.userStrategyData.strategyData
                        ?.description ?? ""
                    }
                  />
                ))
              ) : data?.strategies.length === 0 ? (
                <h1>start </h1>
              ) : (
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
              )}
            </Box>
          </LighterSkeleton>
          <Box
            py="19px"
            px={8}
            w="100%"
            borderBottom="1px solid"
            borderColor="surface.secondary"
          >
            <Text fontSize={12} fontWeight={600} color="neutral.400">
              Unclaimed Rewards
            </Text>
          </Box>
          <LighterSkeleton
            isLoaded={!isLoading}
            h={isLoading ? "60px" : "auto"}
            m="auto"
            w="full"
          >
            <HStack
              px={8}
              py={4}
              pl={12}
              pb={1}
              borderColor="surface.secondary"
              w="100%"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack spacing={4}>
                <LogoIcon color="red.normal" p={0} boxSize="30px" />
                <HStack spacing={0} h="100%" alignItems="flex-start">
                  <Text as="h6" fontSize={16} fontWeight={700}>
                    SOMM
                  </Text>
                </HStack>
              </HStack>
              <VStack
                spacing={0}
                h="100%"
                alignSelf="baseline"
                alignItems="flex-end"
                textAlign="right"
              >
                <Text as="h6" fontSize={16} fontWeight={700}>
                  $
                  {Number(
                    data?.totalSommRewardsInUsd
                  ).toLocaleString()}
                </Text>
                <Text
                  fontWeight={500}
                  fontSize={12}
                  color="neutral.400"
                >
                  {`${
                    data?.totalSommRewards.value === 0
                      ? "0.00"
                      : data?.totalSommRewards.formatted
                  } SOMM`}
                </Text>
              </VStack>
            </HStack>
          </LighterSkeleton>
        </VStack>
      </TransparentCard>
    </VStack>
  )
}

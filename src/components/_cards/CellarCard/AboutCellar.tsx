import React from "react"
import { Flex, Stack, Text, VStack, Box } from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import {
  apyLabel,
  isAPYEnabled,
  isDailyChangeEnabled,
  isTokenPriceEnabled,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { CellarCardData } from "./CellarCardDisplay"
import { UserStats } from "./UserStats"
import { CellarStats, CellarStatsLabel } from "./CellarStats"
import { PercentageText } from "components/PercentageText"
import { isComingSoon } from "utils/isComingSoon"
import { format, utcToZonedTime } from "date-fns-tz"
import { COUNT_DOWN_TIMEZONE } from "utils/config"
import { TransparentSkeleton } from "components/_skeleton"
import { isFuture } from "date-fns"
import { useStrategyData } from "data/hooks/useStrategyData"

interface Props {
  data: CellarCardData
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  const cellarConfig = cellarDataMap[data.cellarId].config
  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address,
    cellarConfig.chain.id
  )

  const launchDate = strategyData?.launchDate
  const baseApy = strategyData?.baseApy
  const rewardsApy = strategyData?.rewardsApy // This might not be directly used if each reward includes its own APY
  const stakingEnd = strategyData?.stakingEnd
  const countdown = isComingSoon(launchDate)

  const launchingDate = (() => {
    if (!launchDate) return "Coming soon"
    const dateTz = utcToZonedTime(
      new Date(launchDate),
      COUNT_DOWN_TIMEZONE
    )
    return `${format(
      dateTz,
      "iii MMM d, h:mmaaa"
    )} ${COUNT_DOWN_TIMEZONE}`
  })()

  const tokenPrice = strategyData?.tokenPrice
  const dailyChange = strategyData?.changes?.daily

  return (
    <>
      {!countdown && (
        <Stack mx={2} spacing={4}>
          <Stack spacing={4}>
            {isAPYEnabled(cellarConfig) &&
              cellarConfig.customReward?.map((reward, index) => (
                <VStack key={index} align="stretch" spacing={4}>
                  <CellarStats
                    tooltip={
                      reward.apyTooltip || apyLabel(cellarConfig)
                    }
                    title={`${reward.tokenSymbol} APY`}
                    value={reward.formattedAPY || "..."}
                    isLoading={isLoading}
                  />
                </VStack>
              ))}

            {isTokenPriceEnabled(cellarConfig) && (
              <CellarStats
                tooltip={tokenPriceTooltipContent(cellarConfig)}
                title="Token price"
                value={tokenPrice || "--"}
                isLoading={isLoading}
                size="md"
              />
            )}
            {isDailyChangeEnabled(cellarConfig) && (
              <Flex alignItems="center">
                <PercentageText data={dailyChange} arrow />
                <CellarStatsLabel
                  title="1D Change"
                  tooltip="% change of current token price vs. token price yesterday"
                />
              </Flex>
            )}
          </Stack>
        </Stack>
      )}
      <Text my={4} mx={2}>
        {data.description}
      </Text>

      {!countdown ? (
        <UserStats
          data={data}
          bg="surface.secondary"
          borderWidth={1}
          borderColor="surface.tertiary"
        />
      ) : (
        <Stack
          padding="12px 16px"
          background="surface.secondary"
          borderRadius={16}
          spacing={0}
          borderWidth={1}
          borderColor="surface.tertiary"
        >
          <Text
            fontWeight="semibold"
            fontSize="10px"
            color="neutral.300"
          >
            Launching
          </Text>
          <Text fontWeight="bold">{launchingDate}</Text>
        </Stack>
      )}
    </>
  )
}

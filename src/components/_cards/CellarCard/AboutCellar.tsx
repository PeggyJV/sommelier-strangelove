import { Flex, Stack, Text } from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import {
  apyLabel,
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  intervalGainTimeline,
  isAPYEnabled,
  isDailyChangeEnabled,
  isIntervalGainPctEnabled,
  isTokenPriceEnabled,
  isTVMEnabled,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { CellarCardData } from "./CellarCardDisplay"

import { UserStats } from "./UserStats"
import { CellarStats, CellarStatsLabel } from "./CellarStats"
import { PercentageText } from "components/PercentageText"
import { isComingSoon } from "utils/isComingSoon"
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
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
    cellarConfig.cellar.address
  )

  const launchDate = strategyData?.launchDate
  const tvm = strategyData?.tvm
  const baseApy = strategyData?.baseApy
  const rewardsApy = strategyData?.rewardsApy
  const intervalGain =
    strategyData?.changes[intervalGainTimeline(cellarConfig)]
  const stakingEnd = strategyData?.stakingEnd
  const countdown = isComingSoon(launchDate)

  const isStakingStillRunning =
    stakingEnd?.endDate && isFuture(stakingEnd?.endDate)
  const apyTooltip = apyLabel(cellarConfig)

  const launchingDate = (() => {
    if (!launchDate) return "Coming soon"
    const dateTz = zonedTimeToUtc(new Date(launchDate), "EST")
    const et = utcToZonedTime(dateTz, COUNT_DOWN_TIMEZONE)
    return `${format(
      et,
      "iii MMM d, h:mmaaa"
    )} ${COUNT_DOWN_TIMEZONE}`
  })()

  const tokenPrice = strategyData?.tokenPrice
  const dailyChange = strategyData?.changes.daily
  return (
    <>
      {!countdown && (
        <Stack mx={2} spacing={1}>
          <Stack spacing={1}>
            {isTVMEnabled(cellarConfig) && (
              <CellarStats
                tooltip="Total value managed by Strategy"
                title="TVM"
                value={tvm?.formatted || "..."}
                size="md"
              />
            )}

            {isAPYEnabled(cellarConfig) &&
              (isLoading ? (
                <>
                  <TransparentSkeleton
                    h="14px"
                    w="80px"
                    startColor="purple.dark"
                    endColor="surface.secondary"
                  />
                  <TransparentSkeleton
                    h="14px"
                    w="100px"
                    startColor="purple.dark"
                    endColor="surface.secondary"
                  />
                </>
              ) : (
                <>
                  {baseApy?.formatted !== "0.0%" && (
                    <CellarStats
                      tooltip={apyTooltip}
                      title={apyLabel(cellarConfig)}
                      value={baseApy?.formatted || "..."}
                      isLoading={isLoading}
                    />
                  )}
                  {isStakingStillRunning &&
                    rewardsApy?.formatted !== "0.0%" && (
                      <CellarStats
                        title="Rewards APY"
                        value={rewardsApy?.formatted || "..."}
                        isLoading={isLoading}
                        colorValue="lime.base"
                      />
                    )}
                </>
              ))}
          </Stack>

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

          {isIntervalGainPctEnabled(cellarConfig) && (
            <Flex alignItems="center">
              <PercentageText data={intervalGain} />
              <CellarStatsLabel
                title={intervalGainPctTitleContent(cellarConfig)}
                tooltip={intervalGainPctTooltipContent(cellarConfig)}
              />
            </Flex>
          )}
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

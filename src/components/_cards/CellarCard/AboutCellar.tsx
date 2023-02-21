import { Flex, Stack, Text } from "@chakra-ui/react"
import { cellarDataMap } from "data/cellarDataMap"
import { useApy } from "data/hooks/useApy"
import { useTvm } from "data/hooks/useTvm"
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
import { useDailyChange } from "data/hooks/useDailyChange"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { PercentageText } from "components/PercentageText"
import { useIntervalGain } from "data/hooks/useIntervalGain"
import { isComingSoon } from "utils/isComingSoon"
import { format, utcToZonedTime, zonedTimeToUtc } from "date-fns-tz"
import { COUNT_DOWN_TIMEZONE } from "utils/config"
import { TransparentSkeleton } from "components/_skeleton"
import { useStakingEnd } from "data/hooks/useStakingEnd"
import { isFuture } from "date-fns"

interface Props {
  data: CellarCardData
}

export const AboutCellar: React.FC<Props> = ({ data }) => {
  const cellarConfig = cellarDataMap[data.cellarId].config
  const launchDate = cellarDataMap[data.cellarId].launchDate
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(
    cellarDataMap[data.cellarId]
  )
  const intervalGainPct = useIntervalGain({
    config: cellarConfig,
    timeline: intervalGainTimeline(cellarConfig),
  })
  const countdown = isComingSoon(launchDate)
  const stakingEnd = useStakingEnd(cellarConfig)
  const isStakingStillRunning =
    stakingEnd.data?.endDate && isFuture(stakingEnd.data?.endDate)

  const launchingDate = (() => {
    if (!launchDate) return "Coming soon"
    const dateTz = zonedTimeToUtc(new Date(launchDate), "EST")
    const et = utcToZonedTime(dateTz, COUNT_DOWN_TIMEZONE)
    return `${format(
      et,
      "iii MMM d, h:mmaaa"
    )} ${COUNT_DOWN_TIMEZONE}`
  })()

  const tokenPrice = useTokenPrice(cellarConfig)
  const dailyChange = useDailyChange(cellarConfig)
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
              (apyLoading ? (
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
                  {apy?.apy !== "0.0%" && (
                    <CellarStats
                      tooltip={apy?.apyLabel}
                      title={apyLabel(cellarConfig)}
                      value={apy?.apy || "..."}
                      isLoading={apyLoading}
                    />
                  )}
                  {isStakingStillRunning &&
                    apy?.potentialStakingApy !== "0.0%" && (
                      <CellarStats
                        title="Rewards APY"
                        value={apy?.potentialStakingApy || "..."}
                        isLoading={apyLoading}
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
              value={tokenPrice.data || "--"}
              isLoading={tokenPrice.isLoading}
              size="md"
            />
          )}
          {isDailyChangeEnabled(cellarConfig) && (
            <Flex alignItems="center">
              <PercentageText data={dailyChange.data} arrow />
              <CellarStatsLabel
                title="1D Change"
                tooltip="% change of current token price vs. token price yesterday"
              />
            </Flex>
          )}

          {isIntervalGainPctEnabled(cellarConfig) && (
            <Flex alignItems="center">
              <PercentageText data={intervalGainPct.data} />
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

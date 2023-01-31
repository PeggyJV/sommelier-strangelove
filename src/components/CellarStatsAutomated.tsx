import { VFC } from "react"
import {
  Box,
  Heading,
  HStack,
  Spinner,
  StackProps,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"
import { CurrentDeposits } from "./CurrentDeposits"
import { InformationIcon } from "./_icons"
import {
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  intervalGainTimeline,
  isCurrentDepositsEnabled,
  isDailyChangeEnabled,
  isIntervalGainPctEnabled,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { ConfigProps } from "data/types"
import { debounce } from "lodash"
import { analytics } from "utils/analytics"
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { PercentageText } from "./PercentageText"
import { useDailyChange } from "data/hooks/useDailyChange"
import { useIntervalGain } from "data/hooks/useIntervalGain"
import { useCurrentDeposits } from "data/hooks/useCurrentDeposits"
import { useCellarCap } from "data/hooks/useCellarCap"
import { useActiveAsset } from "data/hooks/useActiveAsset"

interface CellarStatsAutomatedProps extends StackProps {
  cellarConfig: ConfigProps
}

export const CellarStatsAutomated: VFC<CellarStatsAutomatedProps> = ({
  cellarConfig,
  ...rest
}) => {
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: dailyChange } = useDailyChange(cellarConfig)
  const intervalGainPct = useIntervalGain({
    config: cellarConfig,
    timeline: intervalGainTimeline(cellarConfig),
  })
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)

  return (
    <HStack
      spacing={{ base: 2, md: 8 }}
      rowGap={4}
      align="start"
      w={{ base: "full", md: "auto" }}
      justifyContent={{ base: "space-between", md: "unset" }}
      divider={
        <CardDivider
          _last={{
            borderColor,
          }}
        />
      }
      {...rest}
    >
      <VStack spacing={1} align="center">
        <Heading size="md">{tokenPrice ?? <Spinner />}</Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={tokenPriceTooltipContent(cellarConfig)}
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>Token price</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      {isDailyChangeEnabled(cellarConfig) && (
        <VStack spacing={1} align="center">
          <PercentageText data={dailyChange} headingSize="md" arrow />
          <Box
            onMouseEnter={debounce(() => {
              analytics.track("user.tooltip-opened-daily-change")
            }, 1000)}
          >
            <Tooltip
              hasArrow
              placement="top"
              label="% change of current token price vs. token price yesterday"
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack spacing={1} align="center">
                <CardHeading>1D Change</CardHeading>
                <InformationIcon color="neutral.300" boxSize={3} />
              </HStack>
            </Tooltip>
          </Box>
        </VStack>
      )}
      {isIntervalGainPctEnabled(cellarConfig) && (
        <VStack spacing={1} align="center" maxW="7rem">
          <>
            {intervalGainPct.isLoading ? (
              <Spinner />
            ) : (
              <PercentageText
                data={intervalGainPct.data}
                headingSize="md"
              />
            )}
          </>
          <Box
            onMouseEnter={debounce(() => {
              analytics.track("user.tooltip-opened-monthly-change")
            }, 1000)}
          >
            <Tooltip
              hasArrow
              placement="top"
              label={intervalGainPctTooltipContent(cellarConfig)}
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack spacing={1} align="center">
                <CardHeading textAlign="center">
                  {intervalGainPctTitleContent(cellarConfig)}
                </CardHeading>
                <InformationIcon color="neutral.300" boxSize={3} />
              </HStack>
            </Tooltip>
          </Box>
        </VStack>
      )}

      {isCurrentDepositsEnabled(cellarConfig) && (
        <CurrentDeposits
          currentDeposits={currentDeposits?.value}
          cellarCap={cellarCap?.value}
          asset={activeAsset?.symbol}
        />
      )}
    </HStack>
  )
}

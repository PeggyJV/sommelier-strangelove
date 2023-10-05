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
import { InformationIcon } from "./_icons"
import {
  intervalGainPctTitleContent,
  intervalGainPctTooltipContent,
  intervalGainTimeline,
  isDailyChangeEnabled,
  tokenPriceTooltipContent,
} from "data/uiConfig"
import { ConfigProps } from "data/types"
import { debounce } from "lodash"
import { analytics } from "utils/analytics"
import { PercentageText } from "./PercentageText"
import { useStrategyData } from "data/hooks/useStrategyData"

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

  const { data: strategyData, isLoading } = useStrategyData(
    cellarConfig.cellar.address
  )
  const tokenPrice = strategyData?.tokenPrice
  const dailyChange = strategyData?.changes?.daily

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
        <Heading size="md">
          {isLoading ? <Spinner /> : tokenPrice || "--"}
        </Heading>
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
              // analytics.track("user.tooltip-opened-daily-change")
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
    </HStack>
  )
}

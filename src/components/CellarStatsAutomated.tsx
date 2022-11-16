import { ReactNode, VFC } from "react"
import {
  Box,
  Heading,
  HStack,
  StackProps,
  Tooltip,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react"
import { CardDivider } from "./_layout/CardDivider"
import { CardHeading } from "./_typography/CardHeading"
import { CurrentDeposits } from "./CurrentDeposits"
import { InformationIcon } from "./_icons"
import { isCurrentDepositsEnabled } from "data/uiConfig"
import { ConfigProps } from "data/types"
import { debounce } from "lodash"
import { analytics } from "utils/analytics"

interface CellarStatsAutomatedProps extends StackProps {
  tokenPriceTooltip?: string
  tokenPriceLabel?: string
  tokenPriceValue?: ReactNode
  weekChangeTooltip?: string
  weekChangeLabel?: string
  weekChangeValue?: ReactNode
  monthChangeTooltip?: string
  monthChangeLabel?: string
  monthChangeValue?: ReactNode
  cellarConfig: ConfigProps
  currentDeposits?: string
  cellarCap?: string
  asset?: string
}

export const CellarStatsAutomated: VFC<CellarStatsAutomatedProps> = ({
  tokenPriceTooltip,
  tokenPriceLabel,
  tokenPriceValue,
  weekChangeTooltip,
  weekChangeLabel,
  weekChangeValue,
  monthChangeTooltip,
  monthChangeLabel,
  monthChangeValue,
  cellarConfig,
  currentDeposits,
  cellarCap,
  asset,
  ...rest
}) => {
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  return (
    <HStack
      spacing={{ base: 2, md: 8 }}
      rowGap={4}
      align="start"
      w={{ base: "full", md: "auto" }}
      justifyContent={{ base: "space-between", md: "unset" }}
      divider={
        <CardDivider
          css={{
            _last: {
              borderColor,
            },
          }}
        />
      }
      {...rest}
    >
      <VStack spacing={1} align="center">
        <Heading size="md">{tokenPriceValue}</Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={tokenPriceTooltip}
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>{tokenPriceLabel}</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      <VStack spacing={1} align="center">
        {weekChangeValue}
        <Box
          onMouseEnter={debounce(() => {
            analytics.track("user.tooltip-opened-daily-change")
          }, 1000)}
        >
          <Tooltip
            hasArrow
            placement="top"
            label={weekChangeTooltip}
            bg="surface.bg"
            color="neutral.300"
          >
            <HStack spacing={1} align="center">
              <CardHeading>{weekChangeLabel}</CardHeading>
              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
      <VStack spacing={1} align="center" maxW="7rem">
        {monthChangeValue}
        <Box
          onMouseEnter={debounce(() => {
            analytics.track("user.tooltip-opened-monthly-change")
          }, 1000)}
        >
          <Tooltip
            hasArrow
            placement="top"
            label={monthChangeTooltip}
            bg="surface.bg"
            color="neutral.300"
          >
            <HStack spacing={1} align="center">
              <CardHeading textAlign="center">
                {monthChangeLabel}
              </CardHeading>
              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
      {isCurrentDepositsEnabled(cellarConfig) && (
        <CurrentDeposits
          currentDeposits={currentDeposits}
          cellarCap={cellarCap}
          asset={asset}
        />
      )}
    </HStack>
  )
}

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
import { analytics } from "utils/analytics"
import { debounce } from "lodash"
import { isCurrentDepositsEnabled } from "data/uiConfig"
import { ConfigProps } from "data/types"

interface CellarStatsProps extends StackProps {
  firstTooltip?: string
  firstLabel?: string
  firstValue?: ReactNode
  secondTooltip?: string
  secondLabel?: string
  secondValue?: ReactNode
  cellarConfig: ConfigProps
  currentDeposits?: string
  cellarCap?: string
  asset?: string
  isAave?: boolean
}

export const CellarStats: VFC<CellarStatsProps> = ({
  firstTooltip,
  firstLabel,
  firstValue,
  secondTooltip,
  secondLabel,
  secondValue,
  cellarConfig,
  currentDeposits,
  cellarCap,
  asset,
  isAave,
  ...rest
}) => {
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  return (
    <HStack
      spacing={8}
      wrap="wrap"
      rowGap={4}
      divider={
        <CardDivider
          css={{
            "&:nth-last-of-type(2)": {
              borderColor,
            },
          }}
        />
      }
      {...rest}
    >
      <VStack spacing={1} align="flex-start">
        <Heading size="md">{firstValue}</Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={firstTooltip}
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>{firstLabel}</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      {/* REMOVE THIS CONDITION IF WE WANT TO DISPLAY 1W CHANGE PERCENTAGE */}
      {isAave && (
        <VStack spacing={1} align="flex-start">
          {secondValue}
          <Box
            onMouseEnter={debounce(() => {
              analytics.track("user.tooltip-opened-apy")
            }, 1000)}
          >
            <Tooltip
              hasArrow
              placement="top"
              label={secondTooltip}
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack spacing={1} align="center">
                <CardHeading>{secondLabel}</CardHeading>
                <InformationIcon color="neutral.300" boxSize={3} />
              </HStack>
            </Tooltip>
          </Box>
        </VStack>
      )}
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

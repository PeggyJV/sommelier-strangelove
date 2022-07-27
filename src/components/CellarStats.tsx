import { ReactNode, VFC } from "react"
import {
  Box,
  HStack,
  StackProps,
  Text,
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
import { Apy } from "./Apy"

interface CellarStatsProps extends StackProps {
  tvm?: ReactNode
  apy?: ReactNode
  apyTooltip?: string
  currentDeposits?: string
  cellarCap?: string
  asset?: string
}

export const CellarStats: VFC<CellarStatsProps> = ({
  tvm,
  apy,
  apyTooltip,
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
      spacing={8}
      align="flex-start"
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
        <Text as="span" fontSize="21px" fontWeight="bold">
          {tvm}
        </Text>
        <Tooltip
          hasArrow
          placement="top"
          label="Total value managed by Cellar"
          bg="surface.bg"
        >
          <HStack spacing={1} align="center">
            <CardHeading>TVM</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      <VStack spacing={1} align="flex-start">
        <Apy apy={apy} />
        <Box
          onMouseEnter={debounce(() => {
            analytics.track("user.tooltip-opened-apy")
          }, 1000)}
        >
          <Tooltip
            hasArrow
            placement="top"
            label={apyTooltip}
            bg="surface.bg"
          >
            <HStack spacing={1} align="center">
              <CardHeading>Expected APY</CardHeading>
              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
      <CurrentDeposits
        currentDeposits={currentDeposits}
        cellarCap={cellarCap}
        asset={asset}
      />
    </HStack>
  )
}

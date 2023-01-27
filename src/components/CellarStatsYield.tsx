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
import { InformationIcon } from "./_icons"
import { Apy } from "./Apy"
import { ConfigProps } from "data/types"

interface CellarStatsYieldProps extends StackProps {
  tvm?: ReactNode
  apy?: ReactNode
  apyTooltip?: string
  rewardsApy?: ReactNode
  currentDeposits?: string
  cellarCap?: string
  asset?: string
  cellarConfig: ConfigProps
}

export const CellarStatsYield: VFC<CellarStatsYieldProps> = ({
  tvm,
  apy,
  apyTooltip,
  currentDeposits,
  cellarCap,
  asset,
  cellarConfig,
  rewardsApy,
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
        <Text as="span" fontSize="21px" fontWeight="bold">
          {tvm}
        </Text>
        <Tooltip
          hasArrow
          placement="top"
          label="Total value managed by Strategy"
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>TVM</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      <VStack spacing={1} align="center">
        <Apy apy={apy} />
        <Box>
          <Tooltip
            hasArrow
            placement="top"
            label={apyTooltip}
            bg="surface.bg"
            color="neutral.300"
          >
            <HStack spacing={1} align="center">
              <CardHeading>Base APY</CardHeading>
              {apyTooltip && (
                <InformationIcon color="neutral.300" boxSize={3} />
              )}
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
      <VStack spacing={1} align="center">
        <Apy apy={rewardsApy} color="lime.base" />
        <Box>
          <Tooltip
            hasArrow
            placement="top"
            bg="surface.bg"
            color="neutral.300"
          >
            <HStack spacing={1} align="center">
              <CardHeading>Rewards APY</CardHeading>
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
    </HStack>
  )
}

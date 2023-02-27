import { VFC } from "react"
import {
  Box,
  HStack,
  Spinner,
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
import { cellarDataMap } from "data/cellarDataMap"
import { isFuture } from "date-fns"
import { apyLabel } from "data/uiConfig"
import { useStrategyData } from "data/hooks/useStrategyData"

interface CellarStatsYieldProps extends StackProps {
  cellarId: string
}

export const CellarStatsYield: VFC<CellarStatsYieldProps> = ({
  cellarId,
  ...rest
}) => {
  const cellarConfig = cellarDataMap[cellarId].config
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  const { data: strategyData, isLoading: isStrategyLoading } =
    useStrategyData(cellarConfig.cellar.address)

  const tvm = strategyData?.tvm
  const stakingEnd = strategyData?.stakingEnd
  const isStakingStillRunning =
    stakingEnd?.endDate && isFuture(stakingEnd?.endDate)
  const baseApy = strategyData?.baseApy
  const rewardsApy = strategyData?.rewardsApy

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
          {tvm ? `${tvm.formatted}` : <Spinner />}
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
      {baseApy && (
        <VStack spacing={1} align="center">
          <Apy
            apy={isStrategyLoading ? <Spinner /> : baseApy?.formatted}
          />
          <Box>
            <Tooltip
              hasArrow
              placement="top"
              label={apyLabel(cellarConfig)}
              bg="surface.bg"
              color="neutral.300"
            >
              <HStack spacing={1} align="center">
                <CardHeading>{apyLabel(cellarConfig)}</CardHeading>
                {!!apyLabel(cellarConfig) && (
                  <InformationIcon color="neutral.300" boxSize={3} />
                )}
              </HStack>
            </Tooltip>
          </Box>
        </VStack>
      )}

      {isStakingStillRunning && rewardsApy?.formatted !== "0.0%" && (
        <VStack spacing={1} align="center">
          <Apy
            apy={
              isStrategyLoading ? <Spinner /> : rewardsApy?.formatted
            }
            color="lime.base"
          />
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
      )}
    </HStack>
  )
}

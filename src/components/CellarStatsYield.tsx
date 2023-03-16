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
import { useTvm } from "data/hooks/useTvm"
import { useApy } from "data/hooks/useApy"
import { cellarDataMap } from "data/cellarDataMap"
import { isFuture } from "date-fns"
import { useStakingEnd } from "data/hooks/useStakingEnd"
import { apyLabel } from "data/uiConfig"

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

  const { data: tvm } = useTvm(cellarConfig)

  const stakingEnd = useStakingEnd(cellarConfig)
  const isStakingStillRunning =
    stakingEnd.data?.endDate && isFuture(stakingEnd.data?.endDate)
  const { data: apy, isLoading: apyLoading } = useApy(
    cellarDataMap[cellarId]
  )

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
          label="Total value locked"
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <CardHeading>TVL</CardHeading>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </VStack>
      <VStack spacing={1} align="center">
        <Apy apy={apyLoading ? <Spinner /> : apy?.apy} />
        <Box>
          <Tooltip
            hasArrow
            placement="top"
            label={apy?.apyLabel}
            bg="surface.bg"
            color="neutral.300"
          >
            <HStack spacing={1} align="center">
              <CardHeading>{apyLabel(cellarConfig)}</CardHeading>
              {apy?.apyLabel && (
                <InformationIcon color="neutral.300" boxSize={3} />
              )}
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
      {isStakingStillRunning && apy?.potentialStakingApy !== "0.0%" && (
        <VStack spacing={1} align="center">
          <Apy
            apy={apyLoading ? <Spinner /> : apy?.potentialStakingApy}
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

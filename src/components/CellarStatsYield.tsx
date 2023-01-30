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
import { ConfigProps } from "data/types"
import { useTvm } from "data/hooks/useTvm"
import { useApy } from "data/hooks/useApy"

interface CellarStatsYieldProps extends StackProps {
  cellarConfig: ConfigProps
}

export const CellarStatsYield: VFC<CellarStatsYieldProps> = ({
  cellarConfig,
  ...rest
}) => {
  const borderColor = useBreakpointValue({
    sm: "transparent",
    md: "neutral.700",
  })

  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)

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
              <CardHeading>Base APY</CardHeading>
              {apy?.apyLabel && (
                <InformationIcon color="neutral.300" boxSize={3} />
              )}
            </HStack>
          </Tooltip>
        </Box>
      </VStack>
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
    </HStack>
  )
}

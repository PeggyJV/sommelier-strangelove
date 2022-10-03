import {
  Flex,
  Heading,
  Box,
  BoxProps,
  Tooltip,
  HStack,
  Spinner,
} from "@chakra-ui/react"
import { CurrentDeposits } from "components/CurrentDeposits"
import { Label } from "./Label"
import { InformationIcon } from "components/_icons"
import { cellarDataMap } from "data/cellarDataMap"
import { useTvm } from "data/hooks/useTvm"
import { useApy } from "data/hooks/useApy"
import { useCellarCap } from "data/hooks/useCellarCap"
import { useCurrentDeposits } from "data/hooks/useCurrentDeposits"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { isCurrentDepositsEnabled } from "data/uiConfig"

interface Props extends BoxProps {
  cellarId: string
}

export const ValueManaged: React.FC<Props> = ({
  cellarId,
  ...rest
}) => {
  const cellarData = cellarDataMap[cellarId]
  const cellarConfig = cellarData.config
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)
  return (
    <Box {...rest}>
      <Flex alignItems="baseline" mb={1}>
        <Heading size="md">{tvm?.formatted || "..."}</Heading>
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label="Total value managed by Cellar"
          placement="top"
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <Label
              ml={1}
              color="neutral.300"
              display="flex"
              alignItems="center"
              columnGap="4px"
            >
              TVM
            </Label>

            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </Flex>
      <Flex alignItems="center" mb={4}>
        <Heading
          size="sm"
          display="flex"
          alignItems="center"
          columnGap="3px"
        >
          {cellarData.overrideApy?.value ||
            (apyLoading ? <Spinner /> : apy?.expectedApy)}
        </Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={cellarData.overrideApy?.tooltip || apy?.apyLabel}
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <Label ml={1} color="neutral.300">
              {cellarData.overrideApy?.title || "Expected APY"}
            </Label>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </Flex>
      {isCurrentDepositsEnabled(cellarConfig) && (
        <CurrentDeposits
          currentDeposits={currentDeposits?.value}
          cellarCap={cellarCap?.value}
          asset={activeAsset?.symbol}
        />
      )}
    </Box>
  )
}

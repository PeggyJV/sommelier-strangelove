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
import { useOutputData } from "src/composite-data/hooks/output/useOutputData"

interface Props extends BoxProps {
  cellarId: string
}

export const ValueManaged: React.FC<Props> = ({
  cellarId,
  ...rest
}) => {
  const cellarConfig = cellarDataMap[cellarId].config
  const outputData = useOutputData(cellarConfig)
  return (
    <Box {...rest}>
      <Flex alignItems="baseline" mb={1}>
        <Heading size="md">
          {outputData.data.tvm?.formatted || "..."}
        </Heading>
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
          {outputData.isLoading ? (
            <Spinner />
          ) : (
            outputData.data.expectedApy
          )}
        </Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={outputData.data.apyLabel}
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <Label ml={1} color="neutral.300">
              Expected APY
            </Label>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </Flex>
      <CurrentDeposits
        currentDeposits={outputData.data.currentDeposits?.value}
        cellarCap={outputData.data.cellarCap?.value}
        asset={outputData.data.activeSymbol}
      />
    </Box>
  )
}

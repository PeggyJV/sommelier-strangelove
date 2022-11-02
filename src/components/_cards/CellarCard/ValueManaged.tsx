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
import { useTokenPrice } from "data/hooks/useTokenPrice"
import { useWeekChange } from "data/hooks/useWeekChange"
import { FaArrowDown, FaArrowUp } from "react-icons/fa"
import { PercentageText } from "components/PercentageText"

interface Props extends BoxProps {
  cellarId: string
}

export const ValueManaged: React.FC<Props> = ({
  cellarId,
  ...rest
}) => {
  const isAave = cellarId === "AAVE"
  const cellarData = cellarDataMap[cellarId]
  const cellarConfig = cellarData.config
  const { data: tvm } = useTvm(cellarConfig)
  const { data: apy, isLoading: apyLoading } = useApy(cellarConfig)
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  const { data: weekChange } = useWeekChange(cellarConfig)

  const valueManagedData = {
    firstTooltip: isAave
      ? "Total value managed by Strategy"
      : "1 token price which is calculated based on current BTC, ETH, and USDC prices vs their proportions in strategy vs minted tokens in strategy",
    firstLabel: isAave ? "TVM" : "Token price",
    firstValue: isAave ? tvm?.formatted : tokenPrice,
    secondTooltip: isAave
      ? apy?.apyLabel
      : "% of current token price vs token price 1 W(7 days) ago",
    secondLabel: isAave ? "Expected APY" : "1W Change",
    secondValue: isAave ? (
      <Heading
        size="sm"
        display="flex"
        alignItems="center"
        columnGap="3px"
      >
        {apyLoading ? <Spinner /> : apy?.expectedApy}
      </Heading>
    ) : (
      <>
        {weekChange ? (
          <PercentageText
            data={weekChange}
            positiveIcon={FaArrowUp}
            negativeIcon={FaArrowDown}
          />
        ) : (
          <Box>...</Box>
        )}
      </>
    ),
  }

  return (
    <Box {...rest}>
      <Flex alignItems="baseline" mb={1}>
        <Heading size="md">
          {valueManagedData.firstValue || "..."}
        </Heading>
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label={valueManagedData.firstTooltip}
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
              {valueManagedData.firstLabel}
            </Label>

            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </Flex>
      <Flex alignItems="center">
        <Heading
          size="sm"
          display="flex"
          alignItems="center"
          columnGap="3px"
        >
          {valueManagedData.secondValue}
        </Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={valueManagedData.secondTooltip}
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <Label ml={1} color="neutral.300">
              {valueManagedData.secondLabel}
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

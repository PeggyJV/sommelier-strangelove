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
import { useCellarCap } from "data/hooks/useCellarCap"
import { useCurrentDeposits } from "data/hooks/useCurrentDeposits"
import { useActiveAsset } from "data/hooks/useActiveAsset"
import { isCurrentDepositsEnabled } from "data/uiConfig"
import { useTokenPrice } from "data/hooks/useTokenPrice"
// import { useWeekChange } from "data/hooks/useWeekChange"

interface Props extends BoxProps {
  cellarId: string
}

export const TokenPrice: React.FC<Props> = ({
  cellarId,
  ...rest
}) => {
  const cellarData = cellarDataMap[cellarId]
  const cellarConfig = cellarData.config
  const { data: cellarCap } = useCellarCap(cellarConfig)
  const { data: currentDeposits } = useCurrentDeposits(cellarConfig)
  const { data: activeAsset } = useActiveAsset(cellarConfig)
  const { data: tokenPrice } = useTokenPrice(cellarConfig)
  // const { data: weekChange } = useWeekChange(cellarConfig)

  return (
    <Box {...rest}>
      <Flex alignItems="center" mb={1}>
        <Heading size="md">{tokenPrice || <Spinner />}</Heading>
        <Tooltip
          hasArrow
          arrowShadowColor="purple.base"
          label="The dollar value of the ETH, BTC, and USDC that 1 token can be redeemed for"
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
              Token price
            </Label>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </Flex>

      {/* <Flex alignItems="center">
        {weekChange ? (
          <PercentageText
            data={weekChange}
            positiveIcon={FaArrowUp}
            negativeIcon={FaArrowDown}
          />
        ) : (
          <Box>...</Box>
        )}
        <Tooltip
          hasArrow
          placement="top"
          label="% change of current token price vs. token price 1 week ago"
          bg="surface.bg"
          color="neutral.300"
        >
          <HStack spacing={1} align="center">
            <Label ml={1} color="neutral.300">
              1W Change
            </Label>
            <InformationIcon color="neutral.300" boxSize={3} />
          </HStack>
        </Tooltip>
      </Flex> */}
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

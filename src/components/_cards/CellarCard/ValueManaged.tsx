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
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"
import { useGetCellarQuery } from "generated/subgraph"
import { InformationIcon } from "components/_icons"
import BigNumber from "bignumber.js"
import { cellarDataMap } from "data/cellarDataMap"
import { formatCurrency } from "utils/formatCurrency"
import { useAaveStaker } from "context/aaveStakerContext"
import { getExpectedApy } from "utils/cellarApy"
import { useAaveV2Cellar } from "context/aaveV2StablecoinCellar"

interface Props extends BoxProps {
  cellarId: string
}

export const ValueManaged: React.FC<Props> = ({
  cellarId,
  ...rest
}) => {
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: cellarId,
      cellarString: cellarId,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const {
    liquidityLimit,
    addedLiquidityAllTime,
    removedLiquidityAllTime,
    tvlTotal,
  } = cellar || {}
  const currentDepositsVal = formatCurrentDeposits(
    addedLiquidityAllTime,
    removedLiquidityAllTime
  )

  const cellarCap =
    liquidityLimit &&
    new BigNumber(liquidityLimit).dividedBy(10 ** 6).toString()

  const tvlString =
    tvlTotal && new BigNumber(tvlTotal).dividedBy(10 ** 18).toString()
  const tvm = formatCurrency(tvlString)

  const { cellarApy } = cellarDataMap[cellarId]

  // Staker Info
  const { stakerData } = useAaveStaker()
  const { potentialStakingApy, loading: stakerDataLoading } =
    stakerData

  // Cellar Info
  const { cellarData } = useAaveV2Cellar()

  const { expectedApy, formattedCellarApy, formattedStakingApy } =
    getExpectedApy(cellarData.apy, potentialStakingApy)

  const apyLabel = `Expected APY is calculated by combining the Base Cellar APY (${formattedCellarApy}%) and Liquidity Mining Rewards (${formattedStakingApy}%)`

  return (
    <Box {...rest}>
      <Flex alignItems="baseline" mb={1}>
        <Heading size="md">{tvm}</Heading>
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
          {stakerDataLoading || cellarData.loading ? (
            <Spinner />
          ) : (
            expectedApy.toFixed(1).toString() + "%"
          )}
        </Heading>
        <Tooltip
          hasArrow
          placement="top"
          label={apyLabel}
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
        currentDeposits={currentDepositsVal}
        cellarCap={cellarCap}
      />
    </Box>
  )
}

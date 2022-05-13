import { Flex, Heading, Box, BoxProps, Tooltip, HStack } from "@chakra-ui/react"
import { CurrentDeposits } from "components/CurrentDeposits"
import { Label } from "./Label"
import { formatCurrentDeposits } from "utils/formatCurrentDeposits"
import { useGetCellarQuery } from "generated/subgraph"
import { ArrowUpIcon, InformationIcon } from "components/_icons"

interface Props extends BoxProps {
  id: string
}

export const ValueManaged: React.FC<Props> = ({ id, ...rest }) => {
  const [cellarResult] = useGetCellarQuery({
    variables: {
      cellarAddress: id,
      cellarString: id,
    },
  })
  const { data } = cellarResult
  const { cellar } = data || {}
  const { liquidityLimit, addedLiquidityAllTime, removedLiquidityAllTime } =
    cellar || {}
  const currentDepositsVal = formatCurrentDeposits(
    addedLiquidityAllTime,
    removedLiquidityAllTime,
  )

  return (
    <Box {...rest}>
      <Flex alignItems="baseline" mb={1}>
        <Heading size="md">$49.25M</Heading>
        <Label
          ml={1}
          color="neutral.300"
          display="flex"
          alignItems="center"
          columnGap="4px"
        >
          TVM
          <Tooltip
            hasArrow
            arrowShadowColor="purple.base"
            label="Total value managed by Cellar"
            placement="top"
            bg="surface.bg"
          >
            <HStack align="center">
              <InformationIcon color="neutral.300" boxSize={3} />
            </HStack>
          </Tooltip>
        </Label>
      </Flex>
      <Flex alignItems="center" mb={4}>
        <Heading
          size="sm"
          color="lime.base"
          display="flex"
          alignItems="center"
          columnGap="3px"
        >
          <ArrowUpIcon boxSize={3} /> $2,012,394.79 (4.08%)
        </Heading>
        <Label ml={1} color="neutral.300">
          Past Week
        </Label>
      </Flex>
      <CurrentDeposits
        currentDeposits={currentDepositsVal}
        cellarCap={liquidityLimit}
      />
    </Box>
  )
}

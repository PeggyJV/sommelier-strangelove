import { VFC } from "react"
import dynamic from "next/dynamic"
import { Box, HStack, Text, useTheme, VStack } from "@chakra-ui/react"
import { formatCurrency } from "utils/formatCurrency"
const BarChart = dynamic(
  () => import("components/_charts/BarChart"),
  {
    ssr: false,
  }
)

interface CurrentDepositsProps {
  currentDeposits?: string
  cellarCap?: string
}

export const CurrentDeposits: VFC<CurrentDepositsProps> = ({
  currentDeposits,
  cellarCap,
}) => {
  const theme = useTheme()
  const isDataPresent = currentDeposits && cellarCap
  const data = isDataPresent
    ? [{ currentDeposits: parseInt(currentDeposits) }]
    : []

  return (
    <VStack minW={240} align="stretch">
      <HStack justify="space-between" align="flex-end">
        <Text fontSize="0.625rem" color="text.body.lightMuted">
          Current Deposits
        </Text>
        <Text fontSize="xs" fontWeight="semibold">
          ${formatCurrency(currentDeposits)} USDC
        </Text>
      </HStack>
      <Box w="100%" h="4px" bg="#252429" overflow="hidden">
        {/* @ts-ignore */}
        <BarChart
          layout="horizontal"
          colors={theme.colors.lime}
          keys={["currentDeposits"]}
          data={data}
          maxValue={isDataPresent ? parseInt(cellarCap) : "auto"}
          valueScale={{ type: "linear" }}
          enableLabel={false}
          enableGridX={false}
          enableGridY={false}
        />
      </Box>
      <HStack justify="space-between" align="flex-end">
        <Text fontSize="0.625rem" color="text.body.lightMuted">
          Cellar Cap
        </Text>
        <Text fontSize="xs" fontWeight="semibold">
          ${formatCurrency(cellarCap)} USDC
        </Text>
      </HStack>
    </VStack>
  )
}

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
  asset?: string
}

export const CurrentDeposits: VFC<CurrentDepositsProps> = ({
  currentDeposits,
  cellarCap,
  asset,
}) => {
  const theme = useTheme()
  const isDataPresent = currentDeposits && cellarCap

  const getData = () => {
    if (!isDataPresent) return []

    const minValue = parseInt(cellarCap) * 0.01
    const value = parseInt(currentDeposits)

    // Show a line even if value is very small.
    return [{ currentDeposits: value > minValue ? value : minValue }]
  }

  return (
    <VStack minW={240} align="stretch">
      <HStack justify="space-between" align="flex-end">
        <Text fontSize="0.625rem" color="neutral3400">
          Current Deposits
        </Text>
        <Text fontSize="xs" fontWeight="semibold">
          ${formatCurrency(currentDeposits)} {asset}
        </Text>
      </HStack>
      <Box
        w="100%"
        h="4px"
        bg="#252429"
        borderRadius={2}
        overflow="hidden"
      >
        {/* @ts-ignore */}
        <BarChart
          layout="horizontal"
          colors={theme.colors.lime.base}
          keys={["currentDeposits"]}
          data={getData()}
          maxValue={isDataPresent ? parseInt(cellarCap) : "auto"}
          borderRadius={2}
          valueScale={{ type: "linear" }}
          enableLabel={false}
          enableGridX={false}
          enableGridY={false}
        />
      </Box>
      <HStack justify="space-between" align="flex-end">
        <Text fontSize="0.625rem" color="neutral3400">
          Cellar Cap
        </Text>
        <Text fontSize="xs" fontWeight="semibold">
          ${formatCurrency(cellarCap)} {asset}
        </Text>
      </HStack>
    </VStack>
  )
}

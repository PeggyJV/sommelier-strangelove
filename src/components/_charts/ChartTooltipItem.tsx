import { HStack, Box, Text } from "@chakra-ui/react"

interface ChartTooltipItem {
  backgroundColor: string
  name: string
  value: string
  percentage: string
}

export const ChartTooltipItem = (props: ChartTooltipItem) => {
  return (
    <HStack justifyContent="space-between" spacing={4}>
      <HStack>
        <Box
          boxSize="8px"
          backgroundColor={props.backgroundColor}
          borderRadius={2}
        />
        <Text>{props.name}: </Text>
      </HStack>

      <HStack fontFamily="mono">
        <Text textAlign="right">{props.value}</Text>
        <Text width="9ch" textAlign="right">
          {props.percentage}
        </Text>
      </HStack>
    </HStack>
  )
}

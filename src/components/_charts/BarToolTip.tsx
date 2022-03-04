import { Circle, HStack, StackProps, Text } from '@chakra-ui/react'
import { BarTooltipProps } from '@nivo/bar'
import { VFC } from 'react'

export const ToolTip: VFC<StackProps & BarTooltipProps<any>> = ({
  color,
  id,
  value
}) => {
  return (
    <HStack as='span' px={3} py={1} bg='electricIndigo.700' borderRadius={4}>
      <Circle size={4} bgColor={color} />
      <Text>
        {id}: {value}%
      </Text>
    </HStack>
  )
}

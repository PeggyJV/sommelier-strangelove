import {
  Circle,
  ComponentWithAs,
  forwardRef,
  HStack,
  Text,
} from "@chakra-ui/react"
import { BarTooltipProps } from "@nivo/bar"

export const ToolTip: ComponentWithAs<
  "span",
  BarTooltipProps<any>
> = forwardRef(({ color, id, value }, ref) => {
  return (
    <HStack
      ref={ref}
      as="span"
      px={3}
      py={1}
      bg="brand.background"
      borderWidth={1}
      borderColor="border.subtle"
      borderRadius="md"
    >
      <Circle size={4} bgColor={color} />
      <Text textTransform="capitalize" color="text.primary">
        {id}: {value}%
      </Text>
    </HStack>
  )
})

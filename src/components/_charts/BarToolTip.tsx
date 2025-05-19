import {
  Circle,
  ComponentWithAs,
  forwardRef,
  HStack,
  Text,
} from "@chakra-ui/react"
import { BarTooltipProps } from "@nivo/bar"

export const ToolTip: ComponentWithAs<"span", BarTooltipProps<any>> = forwardRef(
  ({ color, id, value }, ref) => {
    return (
      <HStack
        ref={ref}
        as="span"
        px={3}
        py={1}
        bg="surface.bg"
        borderWidth={1}
        borderColor="purple.base"
        borderRadius={4}
      >
        <Circle size={4} bgColor={color} />
        <Text textTransform="capitalize">
          {id}: {value}%
        </Text>
      </HStack>
    )
  }
)

import { Box, ComponentWithAs, forwardRef, Text } from "@chakra-ui/react"
import { LineSeries, PointTooltipProps } from "@nivo/line"

export const ToolTip: ComponentWithAs<"span", PointTooltipProps<LineSeries>> =
  forwardRef(({ point }, ref) => {
    const { data } = point

    return (
      <Box
        ref={ref}
        px={3}
        py={1}
        bg="surface.bg"
        borderWidth={1}
        borderColor="purple.base"
        borderRadius={4}
        textTransform="capitalize"
      >
        <Text>date: {data.xFormatted}</Text>
        <Text>TVL: {data.yFormatted}</Text>
      </Box>
    )
  }
)

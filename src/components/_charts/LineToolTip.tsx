import { Box, BoxProps, forwardRef, Text } from "@chakra-ui/react"
import { PointTooltipProps } from "@nivo/line"
import { VFC } from "react"

export const ToolTip: VFC<BoxProps & PointTooltipProps> = forwardRef(
  ({ point }, ref) => {
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
        <Text>TVM: {data.yFormatted}</Text>
      </Box>
    )
  }
)

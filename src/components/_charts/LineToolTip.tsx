import { Box, BoxProps, forwardRef } from "@chakra-ui/react"
import { PointTooltipProps } from "@nivo/line"
import { VFC } from "react"

export const ToolTip: VFC<BoxProps & PointTooltipProps> = forwardRef(
  ({ point }, ref) => {
    const { data } = point

    return (
      <Box
        ref={ref}
        as="span"
        px={3}
        py={1}
        bg="surface.bg"
        borderWidth={1}
        borderColor="purple.base"
        borderRadius={4}
        textTransform="capitalize"
      >
        {data.xFormatted}
      </Box>
    )
  }
)

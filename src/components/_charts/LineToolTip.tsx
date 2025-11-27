import {
  Box,
  ComponentWithAs,
  forwardRef,
  Text,
} from "@chakra-ui/react"
import { LineSeries, PointTooltipProps } from "@nivo/line"

export const ToolTip: ComponentWithAs<
  "span",
  PointTooltipProps<LineSeries>
> = forwardRef(({ point }, ref) => {
  const { data } = point

  return (
    <Box
      ref={ref}
      px={3}
      py={1}
      bg="brand.background"
      borderWidth={1}
      borderColor="border.subtle"
      borderRadius="md"
      textTransform="capitalize"
    >
      <Text color="text.primary">date: {data.xFormatted}</Text>
      <Text color="text.primary">TVL: {data.yFormatted}</Text>
    </Box>
  )
})

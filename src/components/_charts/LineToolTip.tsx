import { Box, BoxProps } from '@chakra-ui/react'
import { PointTooltipProps } from '@nivo/line'
import { VFC } from 'react'

export const ToolTip: VFC<BoxProps & PointTooltipProps> = ({ point }) => {
  const { data } = point

  return (
    <Box as='span' px={3} py={1} bg='electricIndigo.700' borderRadius={4}>
      {data.xFormatted}
    </Box>
  )
}

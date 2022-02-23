import { VFC } from 'react'
import { linearGradientDef } from '@nivo/core'
import { ResponsiveLine, LineSvgProps, PointTooltipProps } from '@nivo/line'
import { Box, BoxProps, useTheme } from '@chakra-ui/react'

const CustomToolTip: VFC<BoxProps & PointTooltipProps> = ({ point }) => {
  const { data } = point

  return (
    <Box as='span' px={3} py={1} bg='gray.600' borderRadius={4}>
      {data.xFormatted}
    </Box>
  )
}

const LineChart: VFC<LineSvgProps> = ({ data, ...rest }) => {
  const { colors } = useTheme()

  return (
    <ResponsiveLine
      data={data}
      defs={[
        linearGradientDef('gradient', [
          { offset: 70, color: 'inherit' },
          { offset: 100, color: 'inherit', opacity: 0 }
        ])
      ]}
      fill={[{ match: '*', id: 'gradient' }]}
      useMesh
      tooltip={CustomToolTip}
      motionConfig={{
        clamp: true,
        duration: 220
      }}
      enableArea
      enablePoints={false}
      colors={[colors.cyan[400]]}
      curve='natural'
      {...rest}
    />
  )
}

export default LineChart

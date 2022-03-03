import { VFC } from 'react'
import { linearGradientDef } from '@nivo/core'
import { ResponsiveLine, LineSvgProps } from '@nivo/line'
import { useTheme } from '@chakra-ui/react'
import { ToolTip } from './ToolTip'

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
      enableGridX={false}
      enableGridY={false}
      tooltip={ToolTip}
      motionConfig={{
        clamp: true,
        duration: 220
      }}
      enableArea
      enablePoints={false}
      colors={[colors.brilliantRose[400]]}
      {...rest}
    />
  )
}

export default LineChart

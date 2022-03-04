import { VFC } from 'react'
import { ResponsiveLine, LineSvgProps } from '@nivo/line'
import { useTheme } from '@chakra-ui/react'
import { ToolTip } from './LineToolTip'

const LineChart: VFC<LineSvgProps> = ({ data, ...rest }) => {
  const { colors } = useTheme()

  return (
    <ResponsiveLine
      data={data}
      useMesh
      enableGridX={false}
      enableGridY={false}
      tooltip={ToolTip}
      motionConfig={{
        clamp: true,
        duration: 220
      }}
      enablePoints={false}
      colors={[colors.brilliantRose[400]]}
      {...rest}
    />
  )
}

export default LineChart

import { VFC } from "react"
import { ResponsiveLine, LineSvgProps } from "@nivo/line"
import { ToolTip } from "./LineToolTip"

const LineChart: VFC<LineSvgProps> = ({ data, ...rest }) => {
  return (
    <ResponsiveLine
      data={data}
      useMesh
      enableGridX={false}
      enableGridY={false}
      tooltip={ToolTip}
      motionConfig={{
        clamp: true,
        duration: 220,
      }}
      enablePoints={false}
      {...rest}
    />
  )
}

export default LineChart

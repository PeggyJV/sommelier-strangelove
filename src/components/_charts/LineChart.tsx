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
      motionConfig="default"
      enablePoints={false}
      pointLabelYOffset={0}
      lineWidth={2}
      {...rest}
    />
  )
}

export default LineChart

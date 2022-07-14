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
        duration: 0, // Disable animation upon changing views.
      }}
      enablePoints={false}
      {...rest}
    />
  )
}

export default LineChart

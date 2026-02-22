import {
  ResponsiveLine,
  LineSvgProps,
  LineSeries,
} from "@nivo/line"
import { ToolTip } from "./LineToolTip"

const LineChart = ({
  data,
  ...rest
}: Omit<LineSvgProps<LineSeries>, "width" | "height">) => {
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

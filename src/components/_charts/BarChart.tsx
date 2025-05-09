import { FC } from "react"
import { BarSvgProps, ResponsiveBar } from "@nivo/bar"
import { ToolTip } from "./BarToolTip"

const BarChart: FC<BarSvgProps<any>> = ({ data, ...rest }) => {
  return (
    <ResponsiveBar
      data={data}
      enableLabel={false}
      tooltip={ToolTip as any}
      {...rest}
    />
  )
}

export default BarChart

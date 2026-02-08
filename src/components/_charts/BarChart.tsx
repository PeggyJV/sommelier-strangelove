import { FC } from "react"
import { BarDatum, BarSvgProps, ResponsiveBar } from "@nivo/bar"
import { ToolTip } from "./BarToolTip"

const BarChart: FC<BarSvgProps<BarDatum>> = ({ data, ...rest }) => {
  return (
    <ResponsiveBar
      data={data}
      enableLabel={false}
      tooltip={ToolTip}
      {...rest}
    />
  )
}

export default BarChart

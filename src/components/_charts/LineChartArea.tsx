import { linearGradientDef } from "@nivo/core"
import { LineSvgProps, LineSeries } from "@nivo/line"
import dynamic from "next/dynamic"

const LineChart = dynamic(() => import("./LineChart"), {
  ssr: false,
  loading: () => null,
})

const LineChartArea = ({
  data,
  ...rest
}: LineSvgProps<LineSeries>) => {
  return (
    <LineChart
      data={data}
      defs={[
        linearGradientDef("gradient", [
          { offset: 70, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradient" }]}
      enableArea
      {...rest}
    />
  )
}

export default LineChartArea

import { Circle } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import { PointTooltipProps } from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import { FunctionComponent, VFC } from "react"
import { useEthBtcChart } from "data/context/ethBtcChartContext"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

const ToolTip: FunctionComponent<PointTooltipProps> = ({ point }) => {
  const { color } = point

  return (
    <Circle
      position="relative"
      top="20px"
      size="12px"
      bg={color}
      borderWidth={1}
      borderColor="neutral.100"
    />
  )
}

export const EthBtcChart: VFC = () => {
  const { data } = useEthBtcChart()
  const { chartTheme } = useNivoThemes()
  const lineColors = data.series?.map((item) => item.color)

  return (
    <LineChart
      {...data.chartProps}
      data={data.series!}
      colors={lineColors}
      enableArea={true}
      animate={false}
      crosshairType="x"
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
      margin={{ bottom: 110, left: 26, right: 6, top: 20 }}
      theme={chartTheme}
      tooltip={ToolTip}
      yScale={{
        type: "linear",
        stacked: false,
        max: "auto",
        min: "auto",
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legendPosition: "middle",
      }}
    />
  )
}

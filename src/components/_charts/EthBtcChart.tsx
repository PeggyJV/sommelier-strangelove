import { Circle } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import { PointTooltipProps, Point } from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import { FunctionComponent, VFC } from "react"
import { debounce } from "lodash"
import { useEthBtcChart } from "data/context/ethBtcChartContext"
import { colors } from "theme/colors"
import { formatPercentage } from "utils/chartHelper"
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
  const { data, setTokenPriceChange } = useEthBtcChart()
  const { chartTheme } = useNivoThemes()
  const lineColors = [
    colors.purple.base,
    colors.violet.base,
    colors.turquoise.base,
    colors.orange.base,
  ]
  const updateTokenPriceChange = ({ data: point, id }: Point) => {
    const [_, i] = id.split(".")
    const tokenPriceChange = data.series?.[0].data[Number(i)]?.y
    const valueExists: boolean =
      Boolean(tokenPriceChange) || String(tokenPriceChange) === "0"
    setTokenPriceChange({
      xFormatted: point.xFormatted,
      yFormatted: `
        ${
          valueExists
            ? formatPercentage(String(tokenPriceChange))
            : "--"
        }`,
    })
  }
  const debouncedTokenPrice = debounce(updateTokenPriceChange, 100)

  return (
    <LineChart
      {...data.chartProps}
      data={data.series!}
      colors={lineColors}
      enableArea={true}
      animate={false}
      onMouseMove={debouncedTokenPrice}
      crosshairType="x"
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
      margin={{ bottom: 110, left: 25, right: 6, top: 20 }}
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

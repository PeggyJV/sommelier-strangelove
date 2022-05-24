import { Circle, Spinner } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import { PointTooltipProps, Serie } from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import { TvlData } from "hooks/urql"
import dynamic from "next/dynamic"
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  VFC,
} from "react"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

interface TVLChartProps {
  fetching?: boolean
  data?: Serie[]
  setTvl: Dispatch<SetStateAction<TvlData | undefined>>
}

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

export const TVLChart: VFC<TVLChartProps> = ({
  fetching,
  data,
  setTvl,
  ...rest
}) => {
  const { lineChartTheme, chartTheme } = useNivoThemes()

  return fetching ? (
    <Spinner />
  ) : (
    <LineChart
      data={data!}
      colors={lineChartTheme}
      enableArea={true}
      onMouseMove={({ data }) =>
        setTvl({
          xFormatted: data.xFormatted,
          yFormatted: data.yFormatted,
        })
      }
      crosshairType="x"
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
      margin={{ bottom: 110, left: 6, right: 6, top: 20 }}
      axisLeft={null}
      theme={chartTheme}
      tooltip={ToolTip}
      {...rest}
    />
  )
}

import { Spinner } from "@chakra-ui/react"
import { linearGradientDef } from "@nivo/core"
import { Serie } from "@nivo/line"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import { VFC } from "react"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

interface TVLChartProps {
  fetching?: boolean
  data?: Serie[]
}

export const TVLChart: VFC<TVLChartProps> = ({
  fetching,
  data,
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
      defs={[
        linearGradientDef("gradientA", [
          { offset: 0, color: "inherit" },
          { offset: 100, color: "inherit", opacity: 0 },
        ]),
      ]}
      fill={[{ match: "*", id: "gradientA" }]}
      margin={{ bottom: 70, left: 0, right: 0, top: 20 }}
      axisLeft={null}
      theme={chartTheme}
      {...rest}
    />
  )
}

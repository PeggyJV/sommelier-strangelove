import { Spinner } from "@chakra-ui/react"
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
      margin={{ bottom: 20, left: 20, right: 20, top: 20 }}
      axisLeft={null}
      theme={chartTheme}
      {...rest}
    />
  )
}

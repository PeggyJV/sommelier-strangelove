import { Spinner } from "@chakra-ui/react"
import { Serie } from "@nivo/line"
import {
  useGetHourlyTvlQuery,
  useGetWeeklyTvlQuery,
} from "generated/subgraph"
import { useNivoThemes } from "hooks/nivo"
import dynamic from "next/dynamic"
import { useEffect, useState, VFC } from "react"
import { getPrevious24Hours } from "utils/getPrevious24Hours"
import { mutateDayData, mutateHourlyData } from "utils/urql"
const LineChart = dynamic(
  () => import("components/_charts/LineChart"),
  {
    ssr: false,
  }
)

const epoch = getPrevious24Hours()

export const TVLChart: VFC = () => {
  const { lineChartTheme, chartTheme } = useNivoThemes()
  const [timeline, setTimeline] = useState<string>("24H")
  const [
    { fetching: hourlyIsFetching, data: hourlyData },
    reexecuteHourly,
  ] = useGetHourlyTvlQuery({ variables: { epoch } })
  const [
    { fetching: weeklyIsFetching, data: weeklyData },
    reexecuteWeekly,
  ] = useGetWeeklyTvlQuery()
  const [data, setData] = useState<Serie[] | undefined>([
    { id: "tvl", data: [{ x: new Date(), y: 0 }] },
  ])

  const timeButtons = [
    {
      title: "24H",
      onClick: () => {
        setData(mutateHourlyData(hourlyData))
      },
    },
    {
      title: "1W",
      onClick: () => {
        setData(mutateDayData(weeklyData))
      },
    },
    { title: "All Time", onClick: reexecuteHourly },
  ]

  useEffect(() => {
    if (hourlyData) {
      setData(mutateHourlyData(hourlyData))
    }
  }, [hourlyData])

  return hourlyIsFetching || weeklyIsFetching ? (
    <Spinner />
  ) : (
    <LineChart
      data={data!}
      colors={lineChartTheme}
      margin={{ bottom: 20, left: 20, right: 20, top: 20 }}
      xScale={{
        type: "time",
        format: "%Y-%m-%d %H:%M",
        useUTC: false,
        precision: "hour",
      }}
      xFormat="time:%Y-%m-%d %H:%M"
      axisBottom={{
        format: "%H:%M",
        tickValues: "every 2 hours",
      }}
      axisLeft={null}
      theme={chartTheme}
    />
  )
}

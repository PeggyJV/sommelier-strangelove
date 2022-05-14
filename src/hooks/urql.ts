import { LineProps, Serie } from "@nivo/line"
import {
  useGetAllTimeTvlQuery,
  useGetHourlyTvlQuery,
  useGetWeeklyTvlQuery,
} from "generated/subgraph"
import { useEffect, useState } from "react"
import { mutateDayData, mutateHourlyData } from "utils/urql"

interface DataProps {
  series?: Serie[]
  chartProps: Partial<LineProps>
}

const hourlyChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%H:%M",
    tickValues: "every 2 hours",
  },
  xFormat: "time:%Y-%m-%d %H:%M",
  xScale: {
    type: "time",
    format: "%Y-%m-%d %H:%M",
    useUTC: false,
    precision: "hour",
  },
}
const dayChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%Y-%m-%d",
    tickValues: "every day",
  },
  xFormat: "time:%Y-%m-%d",
  xScale: {
    type: "time",
    format: "%Y-%m-%d",
    useUTC: false,
    precision: "day",
  },
}

export const useTVLQueries = (epoch: number) => {
  // GQL Queries
  const [
    { fetching: hourlyIsFetching, data: hourlyData },
    reexecuteHourly,
  ] = useGetHourlyTvlQuery({ variables: { epoch } })
  const [
    { fetching: weeklyIsFetching, data: weeklyData },
    reexecuteWeekly,
  ] = useGetWeeklyTvlQuery()
  const [
    { fetching: allTimeIsFetching, data: allTimeData },
    reexecuteAllTime,
  ] = useGetAllTimeTvlQuery()

  // Set data to be returned by hook
  const [data, setData] = useState<DataProps>({
    series: [{ id: "tvl", data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  })

  // Set hourly data by default
  useEffect(() => {
    if (hourlyData) {
      setData({
        series: mutateHourlyData(hourlyData),
        chartProps: hourlyChartProps,
      })
    }
  }, [hourlyData])

  // Grouped loading state
  const fetching =
    hourlyIsFetching || weeklyIsFetching || allTimeIsFetching

  // Functions to update data returned by hook
  const setDataHourly = () =>
    setData({
      series: mutateHourlyData(hourlyData),
      chartProps: hourlyChartProps,
    })
  const setDataWeekly = () =>
    setData({
      series: mutateDayData(weeklyData),
      chartProps: dayChartProps,
    })
  const setDataAllTime = () =>
    setData({
      series: mutateDayData(allTimeData),
      chartProps: dayChartProps,
    })

  return {
    fetching,
    data,
    setDataHourly,
    setDataWeekly,
    setDataAllTime,
    reexecuteHourly,
    reexecuteWeekly,
    reexecuteAllTime,
  }
}

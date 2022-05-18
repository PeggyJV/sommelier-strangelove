import { LineProps, Serie } from "@nivo/line"
import {
  useGetAllTimeTvlQuery,
  useGetHourlyTvlQuery,
  useGetWeeklyTvlQuery,
} from "generated/subgraph"
import { useEffect, useState } from "react"
import { getPreviousWeek } from "utils/calculateTime"
import { mutateDayData, mutateHourlyData } from "utils/urql"

interface DataProps {
  series?: Serie[]
  chartProps: Partial<LineProps>
}

const hourlyChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%m/%d: %H:%M",
    tickValues: "every 6 hours",
  },
  xFormat: "time:%m/%d: %H:%M",
  xScale: {
    type: "time",
    format: "%H:%M",
    useUTC: false,
    precision: "hour",
  },
}
const dayChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%m/%d/%y",
    tickValues: "every day",
  },
  xFormat: "time:%m/%d/%y",
  xScale: {
    type: "time",
    format: "%m/%d/%y",
    useUTC: false,
    precision: "day",
  },
}
const allTimeChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%m/%d/%y",
    tickValues: "every 2 days",
  },
  xFormat: "time:%m/%d/%y",
  xScale: {
    type: "time",
    format: "%m/%d/%y",
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
  ] = useGetWeeklyTvlQuery({
    variables: { epoch: getPreviousWeek() },
  })
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
      chartProps: allTimeChartProps,
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

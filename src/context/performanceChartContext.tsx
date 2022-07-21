import { LineProps, Serie } from "@nivo/line"
import {
  useGetAllTimeTvlQuery,
  useGetHourlyTvlQuery,
  useGetWeeklyTvlQuery,
} from "generated/subgraph"
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"
import { OperationContext } from "urql"
import {
  getPrevious24Hours,
  getPreviousWeek,
} from "utils/calculateTime"
import { mutateDayData, mutateHourlyData } from "utils/urql"

export interface DataProps {
  series?: Serie[]
  chartProps: Partial<LineProps>
}

export interface TvlData {
  yFormatted: string | number
  xFormatted: string | number
}

export interface PerformanceChartContext {
  fetching: boolean
  data: DataProps
  setDataHourly: () => void
  setDataWeekly: () => void
  setDataAllTime: () => void
  reexecuteHourly: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  reexecuteWeekly: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  reexecuteAllTime: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  timeArray: {
    title: string
    onClick: () => void
  }[]
  tvl: TvlData
  setTvl: Dispatch<SetStateAction<TvlData>>
}

const hourlyChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%m/%d: %H:%M",
    tickValues: "every 6 hours",
  },
  xFormat: "time:%H:%M",
  xScale: {
    type: "time",
    format: "%H:%M",
    useUTC: false,
    precision: "hour",
  },
}
const dayChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%d",
    tickValues: "every day",
  },
  xFormat: "time:%b %d, %Y",
  xScale: {
    type: "time",
    format: "%d",
    useUTC: false,
    precision: "day",
  },
}
const allTimeChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%d",
    tickValues: "every 2 days",
  },
  xFormat: "time:%b %d, %Y",
  xScale: {
    type: "time",
    format: "%d",
    useUTC: false,
    precision: "day",
  },
}

const defaultSerieId = "default"

const initialData: PerformanceChartContext = {
  data: {
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  },
  fetching: true,
  reexecuteHourly: () => null,
  reexecuteWeekly: () => null,
  reexecuteAllTime: () => null,
  setDataAllTime: () => null,
  setDataHourly: () => null,
  setDataWeekly: () => null,
  setTvl: () => null,
  tvl: {
    xFormatted: "",
    yFormatted: "",
  },
  timeArray: [
    {
      title: "",
      onClick: () => null,
    },
  ],
}

const performanceChartContext =
  createContext<PerformanceChartContext>(initialData)

export const PerformanceChartProvider: FC = ({ children }) => {
  // GQL Queries
  const [
    { fetching: hourlyIsFetching, data: hourlyData },
    reexecuteHourly,
  ] = useGetHourlyTvlQuery({
    variables: { epoch: getPrevious24Hours() },
  })
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
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  })
  // console.log({ data })

  // Set tvl value
  const [tvl, setTvl] = useState<TvlData>({
    xFormatted: "",
    yFormatted: "",
  })

  // Set hourly data by default
  useEffect(() => {
    const idIsDefault: boolean =
      data?.series![0].id === defaultSerieId

    if (hourlyData && idIsDefault) {
      setData({
        series: mutateHourlyData(hourlyData),
        chartProps: hourlyChartProps,
      })
    }
  }, [hourlyData, data])

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

  const timeArray = [
    {
      title: "Day",
      onClick: setDataHourly,
    },
    {
      title: "Week",
      onClick: setDataWeekly,
    },
    { title: "All", onClick: setDataAllTime },
  ]

  return (
    <performanceChartContext.Provider
      value={{
        fetching,
        data,
        setDataHourly,
        setDataWeekly,
        setDataAllTime,
        reexecuteHourly,
        reexecuteWeekly,
        reexecuteAllTime,
        timeArray,
        tvl,
        setTvl,
      }}
    >
      {children}
    </performanceChartContext.Provider>
  )
}

export const usePerformanceChart = () => {
  const context = useContext(performanceChartContext)

  if (context === undefined) {
    throw new Error(
      "This hook must be used within a PerformanceChartProvider."
    )
  }

  return context
}

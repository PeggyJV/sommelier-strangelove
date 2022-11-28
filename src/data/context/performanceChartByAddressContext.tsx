import { LineProps, Serie } from "@nivo/line"
import {
  useGetAllTimeTvlByAddressQuery,
  useGetHourlyTvlByAddressQuery,
  useGetWeeklyTvlByAdressQuery,
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
import { formatDecimals } from "utils/bigNumber"
import {
  getPrevious24Hours,
  getPreviousWeek,
} from "utils/calculateTime"
import { createTVLSeries } from "utils/chartHelper"
import { formatCurrency } from "utils/formatCurrency"

export interface DataProps {
  series?: Serie[]
  chartProps: Partial<LineProps>
}

export interface TvlData {
  yFormatted: string | number
  xFormatted: string | number
}

export interface PerformanceChartContext {
  isFetching: boolean
  isError: boolean
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
  isFetching: true,
  isError: false,
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

const performanceChartByAddressContext =
  createContext<PerformanceChartContext>(initialData)

export const PerformanceChartByAddressProvider: FC<{
  address: string
}> = ({ children, address }) => {
  // GQL Queries
  const [
    {
      fetching: hourlyIsFetching,
      data: hourlyData,
      error: hourlyError,
    },
    reexecuteHourly,
  ] = useGetHourlyTvlByAddressQuery({
    variables: {
      epoch: getPrevious24Hours(),
      cellarAddress: address,
    },
  })
  const [
    {
      fetching: weeklyIsFetching,
      data: weeklyData,
      error: weeklyError,
    },
    reexecuteWeekly,
  ] = useGetWeeklyTvlByAdressQuery({
    variables: {
      epoch: getPreviousWeek(),
      cellarAddress: address,
    },
  })
  const [
    {
      fetching: allTimeIsFetching,
      data: allTimeData,
      error: allTimeError,
    },
    reexecuteAllTime,
  ] = useGetAllTimeTvlByAddressQuery({
    variables: {
      cellarAddress: address,
    },
  })

  // Set data to be returned by hook
  const [data, setData] = useState<DataProps>({
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  })

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
        series: createTVLSeries(
          hourlyData.cellarHourDatas.map((item) => {
            return {
              date: item.date,
              tvlTotal: item.tvlTotal,
            }
          })
        ),
        chartProps: hourlyChartProps,
      })

      const latestData =
        hourlyData?.cellarHourDatas[
          hourlyData?.cellarHourDatas.length - 1
        ]

      const latestDate = new Date(
        latestData?.date * 1000
      ).toLocaleTimeString(undefined, {
        minute: "2-digit",
        hour: "2-digit",
        hour12: false,
      })

      const latestTvl = `${formatCurrency(
        formatDecimals(latestData?.tvlTotal, 18)
      )}`

      setTvl({
        xFormatted: latestDate,
        yFormatted: latestTvl,
      })
    }
  }, [hourlyData, data])

  // Grouped loading state
  const isFetching =
    hourlyIsFetching || weeklyIsFetching || allTimeIsFetching

  const isError = !!hourlyError || !!weeklyError || !!allTimeError

  // Functions to update data returned by hook
  const setDataHourly = () =>
    setData({
      series: createTVLSeries(
        hourlyData?.cellarHourDatas.map((item) => {
          return {
            date: item.date,
            tvlTotal: item.tvlTotal,
          }
        })
      ),
      chartProps: hourlyChartProps,
    })
  const setDataWeekly = () =>
    setData({
      series: createTVLSeries(
        weeklyData?.cellar?.dayDatas.map((item) => {
          return {
            date: item.date,
            tvlTotal: item.tvlTotal,
          }
        })
      ),
      chartProps: dayChartProps,
    })
  const setDataAllTime = () =>
    setData({
      series: createTVLSeries(
        allTimeData?.cellar?.dayDatas.map((item) => {
          return {
            date: item.date,
            tvlTotal: item.tvlTotal,
          }
        })
      ),
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
    <performanceChartByAddressContext.Provider
      value={{
        isFetching: isFetching,
        isError,
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
    </performanceChartByAddressContext.Provider>
  )
}

export const usePerformanceChartByAddress = () => {
  const context = useContext(performanceChartByAddressContext)

  if (context === undefined) {
    throw new Error(
      "This hook must be used within a PerformanceChartProvider."
    )
  }

  return context
}

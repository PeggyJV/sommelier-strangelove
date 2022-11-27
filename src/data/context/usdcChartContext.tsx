import { LineProps, Serie } from "@nivo/line"
import { useUsdcGainChartData } from "data/hooks/useUsdcGainChartData"
import { format } from "date-fns"
import {
  useGetAllTimeShareValueQuery,
  useGetHourlyShareValueQuery,
  useGetMonthlyShareValueQuery,
  useGetWeeklyShareValueQuery,
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
  getPreviousMonth,
  getPreviousWeek,
} from "utils/calculateTime"
import {
  createUsdcChartSeries,
  createTokenPriceChangeDatum,
  formatPercentage,
} from "utils/chartHelper"

export interface DataProps {
  series?: Serie[]
  chartProps: Partial<LineProps>
}

export interface TokenPriceData {
  yFormatted: string | number
  xFormatted: string | number
}

export interface ShowLine {
  tokenPrice: boolean
  usdc: boolean
}

export interface UsdcChartContext {
  fetching: boolean
  data: DataProps
  setDataHourly: () => void
  setDataWeekly: () => void
  setDataMonthly: () => void
  setDataAllTime: () => void
  reexecuteHourly: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  reexecuteWeekly: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  reexecuteMonthly: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  reexecuteAllTime: (
    opts?: Partial<OperationContext> | undefined
  ) => void
  timeArray: {
    title: string
    onClick: () => void
  }[]
  tokenPriceChange: TokenPriceData
  setTokenPriceChange: Dispatch<SetStateAction<TokenPriceData>>
  showLine: ShowLine
  setShowLine: Dispatch<SetStateAction<ShowLine>>
}

const hourlyChartProps: Partial<LineProps> = {
  axisBottom: {
    format: "%d %H:%M",
    tickValues: "every 3 hours",
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
const monthChartProps: Partial<LineProps> = {
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

const initialData: UsdcChartContext = {
  data: {
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  },
  fetching: true,
  reexecuteHourly: () => null,
  reexecuteWeekly: () => null,
  reexecuteMonthly: () => null,
  reexecuteAllTime: () => null,
  setDataAllTime: () => null,
  setDataHourly: () => null,
  setDataWeekly: () => null,
  setDataMonthly: () => null,
  setTokenPriceChange: () => null,
  tokenPriceChange: {
    xFormatted: "",
    yFormatted: "",
  },
  timeArray: [
    {
      title: "",
      onClick: () => null,
    },
  ],
  showLine: {
    tokenPrice: true,
    usdc: true,
  },
  setShowLine: () => null,
}

const usdcChartContext = createContext<UsdcChartContext>(initialData)

export const UsdcChartProvider: FC<{
  address: string
}> = ({ children, address }) => {
  const [showLine, setShowLine] = useState<ShowLine>({
    tokenPrice: true,
    usdc: true,
  })

  // GQL Queries
  const [
    { fetching: hourlyIsFetching, data: hourlyDataRaw },
    reexecuteHourly,
  ] = useGetHourlyShareValueQuery({
    variables: {
      epoch: getPrevious24Hours(),
      cellarAddress: address,
    },
  })
  const [
    { fetching: weeklyIsFetching, data: weeklyDataRaw },
    reexecuteWeekly,
  ] = useGetWeeklyShareValueQuery({
    variables: {
      epoch: getPreviousWeek(),
      cellarAddress: address,
    },
  })
  const [
    { fetching: monthlyIsFetching, data: monthlyDataRaw },
    reexecuteMonthly,
  ] = useGetMonthlyShareValueQuery({
    variables: {
      epoch: getPreviousMonth(),
      cellarAddress: address,
    },
  })
  const [
    { fetching: allTimeIsFetching, data: allTimeDataRaw },
    reexecuteAllTime,
  ] = useGetAllTimeShareValueQuery({
    variables: {
      cellarAddress: address,
    },
  })
  const hourlyData = hourlyDataRaw?.cellarHourDatas
  const weeklyData = weeklyDataRaw?.cellar?.dayDatas
  const monthlyData = monthlyDataRaw?.cellar?.dayDatas.filter(
    (item) => new Date(item.date * 1000) > new Date(2022, 9, 29)
  )
  const allTimeData = allTimeDataRaw?.cellar?.dayDatas.filter(
    (item) => new Date(item.date * 1000) > new Date(2022, 9, 29)
  )

  const usdcHourly = useUsdcGainChartData({
    day: 1,
    interval: "hourly",
  })
  const usdcWeekly = useUsdcGainChartData({
    day: Number(weeklyData?.length),
    firstDate: new Date(Number(weeklyData?.[0].date) * 1000),
  })
  const usdcMonthly = useUsdcGainChartData({
    day: Number(monthlyData?.length),
    firstDate: new Date(Number(monthlyData?.[0].date) * 1000),
  })
  const usdcAlltime = useUsdcGainChartData({
    day: Number(allTimeData?.length),
    firstDate: new Date(Number(allTimeData?.[0].date) * 1000),
  })

  // Set data to be returned by hook
  const [data, setData] = useState<DataProps>({
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  })

  // Set tvl value
  const [tokenPriceChange, setTokenPriceChange] =
    useState<TokenPriceData>({
      xFormatted: "",
      yFormatted: "",
    })

  // Grouped loading state
  const fetching =
    hourlyIsFetching ||
    weeklyIsFetching ||
    monthlyIsFetching ||
    allTimeIsFetching ||
    usdcHourly.isLoading ||
    usdcWeekly.isLoading ||
    usdcMonthly.isLoading ||
    usdcAlltime.isLoading

  // Functions to update data returned by hook
  const setDataHourly = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      hourlyData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )

    const series = createUsdcChartSeries({
      tokenPrice: tokenPriceDatum,
      usdc: usdcHourly.data?.usdcDatum.slice(
        0,
        tokenPriceDatum?.length
      ),
    })
    setData({
      series,
      chartProps: hourlyChartProps,
    })
    const latestData = series[0].data.at(-1)
    const firstData = series[0].data.at(0)

    const valueExists: boolean =
      Boolean(latestData?.y) || String(latestData?.y) === "0"

    const dateText = `${format(
      new Date(String(firstData?.x)),
      "HH:mm d MMM"
    )} - ${format(
      new Date(String(latestData?.x)),
      "HH:mm d MMM yyyy"
    )}`
    setTokenPriceChange({
      xFormatted: dateText,
      yFormatted: `${
        valueExists ? formatPercentage(String(latestData?.y)) : "--"
      }`,
    })
  }

  const setDataWeekly = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      weeklyData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )

    const series = createUsdcChartSeries({
      tokenPrice: tokenPriceDatum,
      usdc: usdcWeekly.data?.usdcDatum.slice(
        0,
        tokenPriceDatum?.length
      ),
    })
    setData({
      series,
      chartProps: dayChartProps,
    })
    const latestData = series![0].data.at(-1)
    const firstData = series![0].data.at(0)

    const latestDate = format(
      new Date(String(latestData?.x)),
      "d MMM yyyy"
    )
    const dateText = `${format(
      new Date(String(firstData?.x)),
      "d MMM"
    )} - ${latestDate}`
    const valueExists: boolean =
      Boolean(latestData?.y) || String(latestData?.y) === "0"
    setTokenPriceChange({
      xFormatted: dateText,
      yFormatted: `${
        valueExists ? formatPercentage(String(latestData?.y)) : "--"
      }`,
    })
  }

  const setDataMonthly = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      monthlyData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )
    const series = createUsdcChartSeries({
      tokenPrice: tokenPriceDatum,
      usdc: usdcMonthly.data?.usdcDatum.slice(
        0,
        tokenPriceDatum?.length
      ),
    })
    setData({
      series,
      chartProps: monthChartProps,
    })

    const latestData = series[0].data.at(-1)
    const firstData = series[0].data.at(0)

    const valueExists: boolean =
      Boolean(latestData?.y) || String(latestData?.y) === "0"
    const dateText = `${format(
      new Date(String(firstData?.x)),
      "d MMM"
    )} - ${format(new Date(String(latestData?.x)), "d MMM yyyy")}`
    setTokenPriceChange({
      xFormatted: dateText,
      yFormatted: `${
        valueExists ? formatPercentage(String(latestData?.y)) : "--"
      }`,
    })
  }

  const setDataAllTime = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      allTimeData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )
    const series = createUsdcChartSeries({
      tokenPrice: tokenPriceDatum,
      usdc: usdcAlltime.data?.usdcDatum.slice(
        0,
        tokenPriceDatum?.length
      ),
    })
    setData({
      series,
      chartProps: allTimeChartProps,
    })

    const latestData = series[0].data.at(-1)
    const firstData = series[0].data.at(0)

    const valueExists: boolean =
      Boolean(latestData?.y) || String(latestData?.y) === "0"
    const dateText = `${format(
      new Date(String(firstData?.x)),
      "d MMM yyyy"
    )} - ${format(new Date(String(latestData?.x)), "d MMM yyyy")}`
    setTokenPriceChange({
      xFormatted: dateText,
      yFormatted: `${
        valueExists ? formatPercentage(String(latestData?.y)) : "--"
      }`,
    })
  }

  const timeArray = [
    {
      title: "1D",
      onClick: setDataHourly,
    },
    {
      title: "1W",
      onClick: setDataWeekly,
    },
    {
      title: "1M",
      onClick: setDataMonthly,
    },
    { title: "All", onClick: setDataAllTime },
  ]

  // Set weekly data by default
  useEffect(() => {
    const idIsDefault: boolean =
      data?.series![0].id === defaultSerieId
    if (weeklyData && idIsDefault && usdcWeekly.data) {
      const weeklyDataMap = weeklyData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
      const tokenPriceDatum =
        createTokenPriceChangeDatum(weeklyDataMap)

      const series = createUsdcChartSeries({
        tokenPrice: tokenPriceDatum,
        usdc: usdcWeekly.data?.usdcDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
      })

      setData({
        series,
        chartProps: dayChartProps,
      })

      const latestData = series![0].data.at(-1)
      const firstData = series![0].data.at(0)

      const latestDate = format(
        new Date(String(latestData?.x)),
        "d MMM yyyy"
      )
      const dateText = `${format(
        new Date(String(firstData?.x)),
        "d MMM"
      )} - ${latestDate}`
      const valueExists: boolean =
        Boolean(latestData?.y) || String(latestData?.y) === "0"
      setTokenPriceChange({
        xFormatted: dateText,
        yFormatted: `${
          valueExists ? formatPercentage(String(latestData?.y)) : "--"
        }`,
      })
    }
  }, [weeklyData, data, usdcWeekly.data])

  const dataC = {
    ...data,
    series: data.series?.filter((item) => {
      if (item.id === "token-price") {
        return showLine.tokenPrice
      }
      if (item.id === "usdc") {
        return showLine.usdc
      }

      return false
    }),
  }

  return (
    <usdcChartContext.Provider
      value={{
        fetching,
        data: dataC,
        setDataHourly,
        setDataWeekly,
        setDataMonthly,
        setDataAllTime,
        reexecuteHourly,
        reexecuteWeekly,
        reexecuteMonthly,
        reexecuteAllTime,
        timeArray,
        tokenPriceChange,
        setTokenPriceChange,
        showLine,
        setShowLine,
      }}
    >
      {children}
    </usdcChartContext.Provider>
  )
}

export const useUsdcChart = () => {
  const context = useContext(usdcChartContext)

  if (context === undefined) {
    throw new Error(
      "This hook must be used within a UsdcChartProvider."
    )
  }

  return context
}

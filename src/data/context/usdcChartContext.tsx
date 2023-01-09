import { LineProps, Serie } from "@nivo/line"
import { UsdcGainChartData } from "data/actions/common/getUsdcGainChartData"
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

type Timeline = "1D" | "1W" | "1M" | "ALL"

export interface UsdcChartContext {
  isFetching: boolean
  isError: boolean
  data: DataProps
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
  isFetching: true,
  isError: false,
  reexecuteHourly: () => null,
  reexecuteWeekly: () => null,
  reexecuteMonthly: () => null,
  reexecuteAllTime: () => null,
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

const prev24Hours = getPrevious24Hours()
const prevWeek = getPreviousWeek()
const prevMonth = getPreviousMonth()

export const UsdcChartProvider: FC<{
  address: string
}> = ({ children, address }) => {
  const [showLine, setShowLine] = useState<ShowLine>({
    tokenPrice: true,
    usdc: true,
  })
  const [timeline, setTimeline] = useState<Timeline>("1W")
  // GQL Queries
  const [
    {
      fetching: hourlyIsFetching,
      data: hourlyDataRaw,
      error: hourlyError,
    },
    reexecuteHourly,
  ] = useGetHourlyShareValueQuery({
    variables: {
      epoch: prev24Hours,
      cellarAddress: address,
    },
  })
  const [
    {
      fetching: weeklyIsFetching,
      data: weeklyDataRaw,
      error: weeklyError,
    },
    reexecuteWeekly,
  ] = useGetWeeklyShareValueQuery({
    variables: {
      epoch: prevWeek,
      cellarAddress: address,
    },
  })
  const [
    {
      fetching: monthlyIsFetching,
      data: monthlyDataRaw,
      error: monthlyError,
    },
    reexecuteMonthly,
  ] = useGetMonthlyShareValueQuery({
    variables: {
      epoch: prevMonth,
      cellarAddress: address,
    },
  })
  const [
    {
      fetching: allTimeIsFetching,
      data: allTimeDataRaw,
      error: allTimeError,
    },
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

  // Functions to update data returned by hook
  const setDataHourly = (data: UsdcGainChartData) => {
    setTimeline("1D")
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
      usdc: data?.usdcDatum.slice(0, tokenPriceDatum?.length),
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

  const setDataWeekly = (data: UsdcGainChartData) => {
    setTimeline("1W")
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
      usdc: data?.usdcDatum.slice(0, tokenPriceDatum?.length),
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

  const setDataMonthly = (data: UsdcGainChartData) => {
    setTimeline("1M")
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
      usdc: data?.usdcDatum.slice(0, tokenPriceDatum?.length),
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

  const setDataAllTime = (data: UsdcGainChartData) => {
    setTimeline("ALL")
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
      usdc: data?.usdcDatum.slice(0, tokenPriceDatum?.length),
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

  const usdcHourly = useUsdcGainChartData({
    day: 1,
    interval: "hourly",
    enabled: timeline === "1D",
    onSuccess: setDataHourly,
  })
  const usdcWeekly = useUsdcGainChartData({
    day: Number(weeklyData?.length),
    firstDate: new Date(Number(weeklyData?.[0].date) * 1000),
    enabled: timeline === "1W",
    onSuccess: setDataWeekly,
  })
  const usdcMonthly = useUsdcGainChartData({
    day: Number(monthlyData?.length),
    firstDate: new Date(Number(monthlyData?.[0].date) * 1000),
    enabled: timeline === "1M",
    onSuccess: setDataMonthly,
  })
  const usdcAlltime = useUsdcGainChartData({
    day: Number(allTimeData?.length),
    firstDate: new Date(Number(allTimeData?.[0].date) * 1000),
    enabled: timeline === "ALL",
    onSuccess: setDataAllTime,
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
  const isFetching =
    hourlyIsFetching ||
    weeklyIsFetching ||
    monthlyIsFetching ||
    allTimeIsFetching ||
    usdcHourly.isFetching ||
    usdcWeekly.isFetching ||
    usdcMonthly.isFetching ||
    usdcAlltime.isFetching

  const isError =
    !!hourlyError ||
    !!weeklyError ||
    !!monthlyError ||
    !!allTimeError ||
    usdcHourly.isError ||
    usdcWeekly.isError ||
    usdcMonthly.isError ||
    usdcAlltime.isError

  const timeArray = [
    {
      title: "1D",
      onClick: () => setTimeline("1D"),
    },
    {
      title: "1W",
      onClick: () => setTimeline("1W"),
    },
    {
      title: "1M",
      onClick: () => setTimeline("1M"),
    },
    { title: "All", onClick: () => setTimeline("ALL") },
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
        isFetching,
        isError,
        data: dataC,
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

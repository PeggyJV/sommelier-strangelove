import { LineProps, Serie } from "@nivo/line"
import { useEthBtcGainChartData } from "data/hooks/useEthBtcGainChartData"
import {
  useGetAllTimeShareValueQuery,
  useGetHourlyShareValueQuery,
  useGetMonthlyShareValueQuery,
  useGetWeeklyShareValueQuery,
} from "generated/subgraph"
import { toInteger } from "lodash"
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
  createEthBtcChartSeries,
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

export interface EthBtcChartContext {
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

const initialData: EthBtcChartContext = {
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
}

const ethBtcChartContext =
  createContext<EthBtcChartContext>(initialData)

export const EthBtcChartProvider: FC<{
  address: string
}> = ({ children, address }) => {
  // GQL Queries
  const [
    { fetching: hourlyIsFetching, data: hourlyData },
    reexecuteHourly,
  ] = useGetHourlyShareValueQuery({
    variables: {
      epoch: getPrevious24Hours(),
      cellarAddress: address,
    },
  })
  const [
    { fetching: weeklyIsFetching, data: weeklyData },
    reexecuteWeekly,
  ] = useGetWeeklyShareValueQuery({
    variables: {
      epoch: getPreviousWeek(),
      cellarAddress: address,
    },
  })
  const [
    { fetching: monthlyIsFetching, data: monthlyData },
    reexecuteMonthly,
  ] = useGetMonthlyShareValueQuery({
    variables: {
      epoch: getPreviousMonth(),
      cellarAddress: address,
    },
  })
  const [
    { fetching: allTimeIsFetching, data: allTimeData },
    reexecuteAllTime,
  ] = useGetAllTimeShareValueQuery({
    variables: {
      cellarAddress: address,
    },
  })

  const ethBtcHourly = useEthBtcGainChartData(1, "hourly")
  const ethBtcHWeekly = useEthBtcGainChartData(
    weeklyData?.cellar?.dayDatas.length
  )
  const ethBtcMonthly = useEthBtcGainChartData(
    monthlyData?.cellar?.dayDatas.length
  )
  const ethBtcAlltime = useEthBtcGainChartData(
    allTimeData?.cellar?.dayDatas.length
  )

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
    allTimeIsFetching

  // Functions to update data returned by hook
  const setDataHourly = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      hourlyData?.cellarHourDatas.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )
    setData({
      series: createEthBtcChartSeries({
        tokenPrice: tokenPriceDatum,
        ethBtc50: ethBtcHourly.data?.wethWbtcdatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        weth: ethBtcHourly.data?.wethDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        wbtc: ethBtcHourly.data?.wbtcDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
      }),

      chartProps: hourlyChartProps,
    })
  }
  const setDataWeekly = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      weeklyData?.cellar?.dayDatas.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )
    setData({
      series: createEthBtcChartSeries({
        tokenPrice: tokenPriceDatum,
        ethBtc50: ethBtcHWeekly.data?.wethWbtcdatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        weth: ethBtcHWeekly.data?.wethDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        wbtc: ethBtcHWeekly.data?.wbtcDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
      }),

      chartProps: dayChartProps,
    })
  }
  const setDataMonthly = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      monthlyData?.cellar?.dayDatas.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )
    setData({
      series: createEthBtcChartSeries({
        tokenPrice: tokenPriceDatum,
        ethBtc50: ethBtcMonthly.data?.wethWbtcdatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        weth: ethBtcMonthly.data?.wethDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        wbtc: ethBtcMonthly.data?.wbtcDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
      }),
      chartProps: monthChartProps,
    })
  }
  const setDataAllTime = () => {
    const tokenPriceDatum = createTokenPriceChangeDatum(
      allTimeData?.cellar?.dayDatas.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      })
    )
    setData({
      series: createEthBtcChartSeries({
        tokenPrice: tokenPriceDatum,
        ethBtc50: ethBtcAlltime.data?.wethWbtcdatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        weth: ethBtcAlltime.data?.wethDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
        wbtc: ethBtcAlltime.data?.wbtcDatum.slice(
          0,
          tokenPriceDatum?.length
        ),
      }),
      chartProps: allTimeChartProps,
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
    if (weeklyData && idIsDefault && ethBtcHWeekly.data) {
      const latestData =
        weeklyData.cellar?.dayDatas[
          weeklyData.cellar?.dayDatas.length - 1
        ]
      const tokenPriceDatum = createTokenPriceChangeDatum(
        weeklyData?.cellar?.dayDatas.map((item) => {
          return {
            date: item.date,
            shareValue: item.shareValue,
          }
        })
      )
      setData({
        series: createEthBtcChartSeries({
          tokenPrice: tokenPriceDatum,
          ethBtc50: ethBtcHWeekly.data.wethWbtcdatum.slice(
            0,
            tokenPriceDatum?.length
          ),
          weth: ethBtcHWeekly.data?.wethDatum.slice(
            0,
            tokenPriceDatum?.length
          ),
          wbtc: ethBtcHWeekly.data?.wbtcDatum.slice(
            0,
            tokenPriceDatum?.length
          ),
        }),

        chartProps: dayChartProps,
      })

      const latestDate = new Date(
        latestData?.date! * 1000
      ).toLocaleTimeString(undefined, {
        minute: "2-digit",
        hour: "2-digit",
        hour12: false,
      })

      const firstData = weeklyData[0].shareValue

      const change =
        ((toInteger(latestData?.shareValue) - toInteger(firstData)) /
          toInteger(firstData)) *
        100

      const latestTokenPriceChange = `${formatPercentage(
        String(change)
      )}`

      setTokenPriceChange({
        xFormatted: latestDate,
        yFormatted: latestTokenPriceChange,
      })
    }
  }, [weeklyData, data, ethBtcHWeekly.data])

  return (
    <ethBtcChartContext.Provider
      value={{
        fetching,
        data,
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
      }}
    >
      {children}
    </ethBtcChartContext.Provider>
  )
}

export const useEthBtcChart = () => {
  const context = useContext(ethBtcChartContext)

  if (context === undefined) {
    throw new Error(
      "This hook must be used within a EthBtcChartProvider."
    )
  }

  return context
}

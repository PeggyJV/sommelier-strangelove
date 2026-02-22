import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode
} from "react"
import { LineSvgProps, LineSeries } from "@nivo/line"
import { format, subDays } from "date-fns"
import {
  getPreviousMonth,
  getPreviousWeek,
} from "utils/calculateTime"
import { createApyChangeDatum } from "utils/chartHelper"
import {
  cellarDataMap,
  CellaAddressDataMap,
} from "src/data/cellarDataMap"
import { CellarData } from "data/types"
import { config as utilConfig } from "src/utils/config"
import { useStrategyData } from "data/hooks/useStrategyData"
import { fetchWeeklyShareValueData } from "queries/get-weekly-share-value-data"
import { fetchMonthlyShareValueData } from "queries/get-monthly-share-value-data"
import { fetchAllTimeShareValueData } from "queries/get-all-time-share-value-data"
import {
  GetAllTimeShareValueQuery,
  GetMonthlyShareValueQuery,
  GetWeeklyShareValueQuery,
} from "src/data/actions/types"

export interface DataProps {
  series?: LineSeries[]
  chartProps: Partial<LineSvgProps<LineSeries>>
}

export interface ApyData {
  yFormatted: string | number
  xFormatted: string | number
  average: string | number
}

export interface ShowLine {
  apy: boolean
}

type Timeline = "7D" | "30D" | "ALL"

export interface ApyChartContext {
  isFetching: boolean
  isError: boolean
  data: DataProps & { label?: string }
  reexecuteWeekly: () => void
  reexecuteMonthly: () => void
  reexecuteAllTime: () => void
  timeArray: {
    title: string
    onClick: () => void
  }[]
  apyChange: ApyData
  setApyChange: Dispatch<SetStateAction<ApyData>>
  showLine: ShowLine
  setShowLine: Dispatch<SetStateAction<ShowLine>>
}

const hourlyChartProps: Partial<LineSvgProps<LineSeries>> = {
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

const monthChartProps: Partial<LineSvgProps<LineSeries>> = {
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

const allTimeChartProps: Partial<LineSvgProps<LineSeries>> = {
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

const initialData: ApyChartContext = {
  data: {
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  },
  isFetching: true,
  isError: false,
  reexecuteWeekly: () => null,
  reexecuteMonthly: () => null,
  reexecuteAllTime: () => null,
  setApyChange: () => null,
  apyChange: {
    xFormatted: "",
    yFormatted: "",
    average: "",
  },
  timeArray: [
    {
      title: "",
      onClick: () => null,
    },
  ],
  showLine: {
    apy: true,
  },
  setShowLine: () => null,
}

const apyChartContext = createContext<ApyChartContext>(initialData)

const prevWeek = getPreviousWeek()
const prevMonth = getPreviousMonth()

export const ApyChartProvider: FC<{
  address: string
  chain: string
  children: ReactNode
}> = ({ children, address, chain }) => {
  let chainStr = ""
  if (chain !== "ethereum") {
    chainStr = "-" + chain
  }

  const cellarConfig: CellarData =
    CellaAddressDataMap[address.toLowerCase() + chainStr]
  const [showLine, setShowLine] = useState<ShowLine>({
    apy: true,
  })
  const [_timeline, setTimeline] = useState<Timeline>("7D")
  const cellarData = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address === address &&
      item.config.chain.id === cellarConfig.config.chain.id
  )!
  const chainId = cellarData.config.chain.id
  const launchDate = cellarData?.launchDate
  const { data: strategyData, isLoading: isStrategyDataLoading } =
    useStrategyData(
      cellarData.config.cellar.address,
      chainId
    )
  const launchDay = launchDate ?? subDays(new Date(), 8)
  const launchEpoch = Math.floor(launchDay.getTime() / 1000)

  const [_weeklyDataRaw, setWeeklyDataRaw] = useState<
    GetWeeklyShareValueQuery | undefined
  >(undefined)
  const [weeklyIsFetching, setWeeklyIsFetching] = useState(false)
  const [weeklyError, setWeeklyError] = useState(null)
  const [reexecuteWeeklyTrigger, setReexecuteWeeklyTrigger] =
    useState(0) // a state variable to trigger re-fetch

  // useCallback is used to prevent unnecessary re-renders when passing this function down to child components
  const reexecuteWeekly = useCallback(() => {
    setReexecuteWeeklyTrigger((prevState) => prevState + 1)
  }, [])

  useEffect(() => {
    setWeeklyIsFetching(true)
    fetchWeeklyShareValueData(
      prevWeek,
      address,
      chainId
    )
      .then((data) => {
        setWeeklyDataRaw(data)
        setWeeklyIsFetching(false)
      })
      .catch((error) => {
        setWeeklyError(error)
        setWeeklyIsFetching(false)
      })
  }, [address, reexecuteWeeklyTrigger, chainId]) // re-execute the effect when 'address' changes

  const [_monthlyDataRaw, setMonthlyDataRaw] = useState<
    GetMonthlyShareValueQuery | undefined
  >(undefined)
  const [monthlyIsFetching, setMonthlyIsFetching] = useState(false)
  const [monthlyError, setMonthlyError] = useState(null)
  const [reexecuteMonthlyTrigger, setReexecuteMonthlyTrigger] =
    useState(0) // a state variable to trigger re-fetch

  // useCallback is used to prevent unnecessary re-renders when passing this function down to child components
  const reexecuteMonthly = useCallback(() => {
    setReexecuteMonthlyTrigger((prevState) => prevState + 1)
  }, [])

  useEffect(() => {
    setMonthlyIsFetching(true)
    fetchMonthlyShareValueData(
      prevMonth,
      address,
      chainId
    )
      .then((data) => {
        setMonthlyDataRaw(data)
        setMonthlyIsFetching(false)
      })
      .catch((error) => {
        setMonthlyError(error)
        setMonthlyIsFetching(false)
      })
  }, [address, reexecuteMonthlyTrigger, chainId]) // re-execute the effect when 'address' changes

  const [allTimeDataRaw, setAllTimeDataRaw] = useState<
    GetAllTimeShareValueQuery | undefined
  >(undefined)
  const [allTimeIsFetching, setAllTimeIsFetching] = useState(false)
  const [allTimeError, setAllTimeError] = useState(null)
  const [reexecuteAllTimeTrigger, setReexecuteAllTimeTrigger] =
    useState(0) // a state variable to trigger re-fetch

  // useCallback is used to prevent unnecessary re-renders when passing this function down to child components
  const reexecuteAllTime = useCallback(() => {
    setReexecuteAllTimeTrigger((prevState) => prevState + 1)
  }, [])

  useEffect(() => {
    setAllTimeIsFetching(true)
    fetchAllTimeShareValueData(address, chainId)
      .then((data) => {
        setAllTimeDataRaw(data)
        setAllTimeIsFetching(false)
      })
      .catch((error) => {
        setAllTimeError(error)
        setAllTimeIsFetching(false)
      })
  }, [address, reexecuteAllTimeTrigger, chainId])

  // data inverted
  let allTimeData = allTimeDataRaw?.cellar?.dayDatas
    .filter((item) => new Date(item.date * 1000) > launchDay)
    .reverse()

  // Functions to update data returned by hook
  const setDataWeekly = useCallback(() => {
    setTimeline("7D")
    let apyDatum = createApyChangeDatum({
      data: allTimeData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      }),
      launchEpoch,
      decimals: cellarConfig.config.cellar.decimals, // Cellar decimals
      smooth: true,
      daysSmoothed: 7,
      daysRendered: 7,
    })

    const series = [
      {
        id: "apy",
        data: apyDatum || []
      },
    ]

    setData({
      series,
      chartProps: monthChartProps, // Note the use of month chart props here, this is due to the fixed time window
      label: "7D",
    })

    if (
      series &&
      series.length > 0 &&
      series[0].data &&
      series[0].data.length > 0
    ) {
      const latestData = series[0].data.at(-1)
      const firstData = series[0].data.at(0)

      const dateText = `${format(
        new Date(String(firstData?.x ?? new Date())),
        "d MMM yyyy"
      )} - ${format(
        new Date(String(latestData?.x ?? new Date())),
        "d MMM yyyy"
      )}`
      const valueExists: boolean =
        Boolean(latestData?.y) || String(latestData?.y) === "0"

      let average =
        Number(
          apyDatum?.reduce((a, b) => Number(a) + Number(b), 0)
        ) / Number(apyDatum?.length)

      setApyChange({
        xFormatted: dateText,
        yFormatted: `${valueExists ? String(latestData?.y) : "--"}`,
        average: average.toFixed(1) + "%",
      })
    }
  }, [allTimeData, launchEpoch, cellarConfig.config.cellar.decimals])

  const setDataMonthly = useCallback(() => {
    setTimeline("30D")
    let apyDatum = createApyChangeDatum({
      data: allTimeData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      }),
      launchEpoch,
      decimals: cellarConfig.config.cellar.decimals, // Cellar decimals
      smooth: true,
      daysSmoothed: 30,
      daysRendered: 30,
    })
    const series = [
      {
        id: "apy",
        data: apyDatum || []
      },
    ]

    setData({
      series,
      chartProps: monthChartProps,
      label: "30D",
    })

    if (
      series &&
      series.length > 0 &&
      series[0].data &&
      series[0].data.length > 0
    ) {
      const latestData = series[0].data.at(-1)
      const firstData = series[0].data.at(0)

      const dateText = `${format(
        new Date(String(firstData?.x ?? new Date())),
        "d MMM yyyy"
      )} - ${format(
        new Date(String(latestData?.x ?? new Date())),
        "d MMM yyyy"
      )}`
      const valueExists: boolean =
        Boolean(latestData?.y) || String(latestData?.y) === "0"

      let average =
        Number(
          apyDatum?.reduce((a, b) => Number(a) + Number(b), 0)
        ) / Number(apyDatum?.length)

      setApyChange({
        xFormatted: dateText,
        yFormatted: `${valueExists ? String(latestData?.y) : "--"}`,
        average: average.toFixed(1) + "%",
      })
    }
  }, [allTimeData, launchEpoch, cellarConfig.config.cellar.decimals])

  const _setDataAllTime = useCallback(() => {
    setTimeline("ALL")
    let apyDatum = createApyChangeDatum({
      data: allTimeData?.map((item) => {
        return {
          date: item.date,
          shareValue: item.shareValue,
        }
      }),
      launchEpoch,
      decimals: cellarConfig.config.cellar.decimals, // Cellar decimals
      smooth: false,
      daysSmoothed: 0,
      daysRendered: 0,
    })
    const series = [
      {
        id: "apy",
        data: apyDatum || []
      },
    ]
    setData({
      series,
      chartProps: allTimeChartProps,
      label: "All time",
    })

    if (
      series &&
      series.length > 0 &&
      series[0].data &&
      series[0].data.length > 0
    ) {
      const latestData = series[0].data.at(-1)
      const firstData = series[0].data.at(0)

      const dateText = `${format(
        new Date(String(firstData?.x ?? new Date())),
        "d MMM yyyy"
      )} - ${format(
        new Date(String(latestData?.x ?? new Date())),
        "d MMM yyyy"
      )}`
      const valueExists: boolean =
        Boolean(latestData?.y) || String(latestData?.y) === "0"

      let average =
        Number(
          apyDatum?.reduce((a, b) => Number(a) + Number(b), 0)
        ) / Number(apyDatum?.length)

      setApyChange({
        xFormatted: dateText,
        yFormatted: `${valueExists ? String(latestData?.y) : "--"}`,
        average: average.toFixed(1) + "%",
      })
    }
  }, [allTimeData, launchEpoch, cellarConfig.config.cellar.decimals])

  // Set data to be returned by hook
  const [data, setData] = useState<DataProps & { label?: string }>({
    series: [{ id: defaultSerieId, data: [{ x: new Date(), y: 0 }] }],
    chartProps: hourlyChartProps,
  })

  // Set tvl value
  const [apyChange, setApyChange] = useState<ApyData>({
    xFormatted: "",
    yFormatted: "",
    average: "",
  })

  // Grouped loading state
  const isFetching =
    weeklyIsFetching ||
    monthlyIsFetching ||
    allTimeIsFetching ||
    isStrategyDataLoading
  const isError = !!weeklyError || !!monthlyError || !!allTimeError

  let timeArray = [
    {
      title: "7D",
      onClick: setDataWeekly,
    },
    {
      title: "30D",
      onClick: setDataMonthly,
    },
  ]

  // Override time array for Morpho ETH
  if (
    cellarConfig.slug === utilConfig.CONTRACT.MORPHO_ETH.SLUG ||
    cellarConfig.slug === utilConfig.CONTRACT.REAL_YIELD_USD_ARB.SLUG
  ) {
    timeArray = [
      {
        title: "7D",
        onClick: setDataWeekly,
      },
    ]
  }
  useEffect(() => {
    const idIsDefault: boolean =
      data?.series![0].id === defaultSerieId
    if (allTimeData && idIsDefault && strategyData) {
      if (
        cellarConfig.slug === utilConfig.CONTRACT.MORPHO_ETH.SLUG ||
        cellarConfig.slug ===
          utilConfig.CONTRACT.REAL_YIELD_USD_ARB.SLUG
      ) {
        setDataWeekly()
      } else {
        setDataMonthly()
      }
    }
  }, [
    allTimeData,
    data,
    strategyData,
    setDataWeekly,
    setDataMonthly,
    cellarConfig.slug,
  ])

  const dataC = {
    ...data,
    series: data.series?.filter((item) => {
      if (item.id === "apy") {
        return showLine.apy
      }
      return false
    }),
  }

  return (
    <apyChartContext.Provider
      value={{
        isFetching,
        isError,
        data: dataC,
        reexecuteWeekly,
        reexecuteMonthly,
        reexecuteAllTime,
        timeArray,
        apyChange,
        setApyChange,
        showLine,
        setShowLine,
      }}
    >
      {children}
    </apyChartContext.Provider>
  )
}

export const useApyChart = () => {
  const context = useContext(apyChartContext)

  if (context === undefined) {
    throw new Error(
      "This hook must be used within a ApyChartProvider."
    )
  }

  return context
}

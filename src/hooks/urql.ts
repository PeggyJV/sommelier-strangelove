import { Serie } from "@nivo/line"
import {
  useGetHourlyTvlQuery,
  useGetWeeklyTvlQuery,
} from "generated/subgraph"
import { useEffect, useState } from "react"
import { mutateHourlyData } from "utils/urql"

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

  // Set data to be returned by hook
  const [data, setData] = useState<Serie[] | undefined>([
    { id: "tvl", data: [{ x: new Date(), y: 0 }] },
  ])

  // Set hourly data by default
  useEffect(() => {
    if (hourlyData) {
      setData(mutateHourlyData(hourlyData))
    }
  }, [hourlyData])

  return { data }
}

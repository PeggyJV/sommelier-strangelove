import {
  GetHourlyTvlQuery,
  GetWeeklyTvlQuery,
  GetAllTimeTvlQuery,
} from "generated/subgraph"
import { Serie } from "@nivo/line"
import { formatCurrency } from "./formatCurrency"
import { getCalulatedTvl } from "./bigNumber"

const formatTvl = (tvlTotal: string, asset: any) => {
  const total = getCalulatedTvl(tvlTotal, asset)

  const totalString = `${formatCurrency(total)} ${asset?.symbol}`
  return totalString
}

export const mutateHourlyData = (
  data?: GetHourlyTvlQuery
): Serie[] | undefined => {
  if (data) {
    return [
      {
        id: "tvl",
        data: data.cellarHourDatas.map(
          ({ date, tvlTotal, asset }) => {
            return {
              x: new Date(date * 1000),
              y: formatTvl(tvlTotal, asset),
            }
          }
        ),
      },
    ]
  }
}

export const mutateDayData = (
  data?: GetWeeklyTvlQuery | GetAllTimeTvlQuery
): Serie[] | undefined => {
  if (data) {
    return [
      {
        id: "tvl",
        data: data.cellarDayDatas.map(({ date, tvlTotal, asset }) => {
          return {
            x: new Date(date * 1000),
            y: formatTvl(tvlTotal, asset),
          }
        }),
      },
    ]
  }
}

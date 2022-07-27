import {
  GetHourlyTvlQuery,
  GetWeeklyTvlQuery,
  GetAllTimeTvlQuery,
} from "generated/subgraph"
import { Serie } from "@nivo/line"
import { getCalulatedTvl } from "./bigNumber"

// Unsed code. Keeping it in here in case we require it one day.
// const formatTvl = (tvlTotal: string, asset: any) => {
//   // const total = getCalulatedTvl(tvlTotal, asset?.decimals)
//   const total = getCalulatedTvl(tvlTotal, 18)

//   const totalString = `${formatCurrency(total)} ${asset?.symbol}`
//   return totalString
// }

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
              y: getCalulatedTvl(tvlTotal, 18),
              asset,
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
            y: getCalulatedTvl(tvlTotal, 18),
            asset,
          }
        }),
      },
    ]
  }
}

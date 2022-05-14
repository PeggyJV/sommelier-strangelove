import {
  GetHourlyTvlQuery,
  GetWeeklyTvlQuery,
  GetAllTimeTvlQuery,
} from "generated/subgraph"
import { BigNumber } from "bignumber.js"
import { Serie } from "@nivo/line"

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
              y: new BigNumber(tvlTotal)
                .decimalPlaces(asset?.decimals!)
                .toString(),
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
            y: new BigNumber(tvlTotal)
              .decimalPlaces(asset?.decimals!)
              .toString(),
          }
        }),
      },
    ]
  }
}

import { format, isSameDay, subDays } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { GetAssetGainChartDataProps, PriceData } from "../types"
import { MarketChartResponse } from "./fetchMarketChart"

export type UsdcGainChartData = Awaited<
  ReturnType<typeof getUsdcGainChartData>
>

interface GetUsdcGainChartData extends GetAssetGainChartDataProps {
  usdcData: MarketChartResponse
}
// Shift back 1 day coin gecko price is intentional
export const getUsdcGainChartData = async (
  props: GetUsdcGainChartData
) => {
  try {
    const { day, interval, firstDate } = props
    const isDaily = interval === "daily"
    const usdcData = props.usdcData

    const usdcGainPct = (() => {
      let res: PriceData[] = []
      usdcData.prices.map(([date, value]) => {
        const firstDailyDateData =
          isDaily &&
          firstDate &&
          usdcData.prices.find((item) =>
            isSameDay(subDays(new Date(item[0]), 1), firstDate)
          )

        const firstData = isDaily
          ? firstDailyDateData
          : usdcData.prices[0]
        if (firstData) {
          res.push({
            date,
            change: getGainPct(value, firstData[1]),
            value: value,
          })
        }
      })
      return res
    })()

    let usdcMap = new Map()

    usdcGainPct.map((usdc) => {
      const getKey = (date: number) =>
        format(new Date(date), interval === "daily" ? "dLL" : "dHH")

      if (!usdcMap.has(getKey(usdc.date))) {
        usdcMap.set(getKey(usdc.date), {
          x: isDaily
            ? subDays(new Date(usdc.date), 1)
            : new Date(usdc.date),
          y: usdc.change,
          value: usdc.value.toFixed(6),
        })
      }
    })
    return {
      usdcDatum: Array.from(usdcMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}

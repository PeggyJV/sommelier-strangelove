import { closestIndexTo, format, isSameDay, subDays } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

interface PriceData {
  date: number
  change: number
  value: number
}

export type GetEthBtcGainChartDataProps = {
  day: number
  interval: "hourly" | "daily"
  firstDate?: Date
}

// Shift back 1 day coin gecko price is intentional
export const getEthBtcGainChartData = async (
  props: GetEthBtcGainChartDataProps
) => {
  try {
    const { day, interval, firstDate } = props
    const isDaily = interval === "daily"
    const wethData = await fetchMarketChart("weth", day, interval)
    const wbtcData = await fetchMarketChart(
      "wrapped-bitcoin",
      day,
      interval
    )
    const wethGainPct = (() => {
      let res: PriceData[] = []
      wethData.prices.map(([date, value]) => {
        const firstDailyDateData =
          isDaily &&
          firstDate &&
          wethData.prices.find((item) =>
            isSameDay(subDays(new Date(item[0]), 1), firstDate)
          )

        const firstData = isDaily
          ? firstDailyDateData
          : wethData.prices[0]
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

    const wbtcGainPct = (() => {
      let res: PriceData[] = []
      wbtcData.prices.map(([date, value]) => {
        const firstDailyDateData =
          isDaily &&
          firstDate &&
          wbtcData.prices.find((item) =>
            isSameDay(subDays(new Date(item[0]), 1), firstDate)
          )
        const firstData = isDaily
          ? firstDailyDateData
          : wbtcData.prices[0]
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
    let wethMap = new Map()
    let wbtcMap = new Map()
    let wethWbtcMap = new Map()
    wethGainPct.map((weth) => {
      const wbtc =
        wbtcGainPct[
          closestIndexTo(
            new Date(weth.date),
            wethGainPct.map((item) => new Date(item.date))
          )!
        ]
      if (wbtc) {
        if (
          !wethMap.has(
            format(
              new Date(weth.date),
              interval === "daily" ? "dLL" : "dHH"
            )
          )
        ) {
          wethMap.set(
            interval === "daily"
              ? format(new Date(weth.date), "dLL")
              : format(new Date(weth.date), "dHH"),
            {
              x: isDaily
                ? subDays(new Date(weth.date), 1)
                : new Date(weth.date),
              y: weth.change,
              value: weth.value,
            }
          )
        }
        if (
          !wbtcMap.has(
            format(
              new Date(wbtc.date),
              interval === "daily" ? "dLL" : "dHH"
            )
          )
        ) {
          wbtcMap.set(
            interval === "daily"
              ? format(new Date(wbtc.date), "dLL")
              : format(new Date(wbtc.date), "dHH"),
            {
              x: isDaily
                ? subDays(new Date(wbtc.date), 1)
                : new Date(wbtc.date),
              y: wbtc.change,
              value: wbtc.value,
            }
          )
        }
        if (
          !wethWbtcMap.has(
            format(
              new Date(weth.date),
              interval === "daily" ? "dLL" : "dHH"
            )
          )
        ) {
          wethWbtcMap.set(
            interval === "daily"
              ? format(new Date(weth.date), "dLL")
              : format(new Date(weth.date), "dHH"),
            {
              x: isDaily
                ? subDays(new Date(weth.date), 1)
                : new Date(weth.date),
              y: (weth.change + wbtc.change) / 2,
              value: (weth.value + wbtc.value) / 2,
            }
          )
        }
      }
    })

    return {
      wethDatum: Array.from(wethMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
      wbtcDatum: Array.from(wbtcMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
      wethWbtcdatum: Array.from(wethWbtcMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}

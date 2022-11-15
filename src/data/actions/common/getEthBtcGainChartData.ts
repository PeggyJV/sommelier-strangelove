import { Datum } from "@nivo/line"
import { isSameDay } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

export const getEthBtcGainChartData = async (
  day: number,
  interval: "daily" | "hourly" = "daily"
) => {
  try {
    const wethData = await fetchMarketChart("weth", day, interval)
    const wbtcData = await fetchMarketChart(
      "wrapped-bitcoin",
      day,
      interval
    )
    const wethGainPct = (() => {
      let res: {
        date: number
        change: number
      }[] = []
      wethData.prices.map(([date, value], index) => {
        const firstData = wethData.prices[0]
        if (firstData) {
          res.push({
            date,
            change: getGainPct(value, firstData[1]),
          })
        }
      })
      return res
    })()

    const wbtcGainPct = (() => {
      let res: {
        date: number
        change: number
      }[] = []
      wbtcData.prices.map(([date, value], index) => {
        const firstData = wbtcData.prices[0]
        if (firstData) {
          res.push({
            date,
            change: getGainPct(value, firstData[1]),
          })
        }
      })
      return res
    })()
    let wethDatum: Datum[] = []
    let wbtcDatum: Datum[] = []
    let wethWbtcdatum: Datum[] = []

    wethGainPct.map((weth, index) => {
      const wbtc =
        interval === "daily"
          ? wbtcGainPct.find((item) =>
              isSameDay(new Date(item.date), new Date(weth.date))
            ) // daily
          : wbtcGainPct[index] //hourly
      if (wbtc) {
        wethDatum.push({
          x: new Date(weth.date),
          y: weth.change,
        })
        wbtcDatum.push({
          x: new Date(wbtc.date),
          y: wbtc.change,
        })
        wethWbtcdatum.push({
          x: new Date(weth.date),
          y: (weth.change + wbtc.change) / 2,
        })
      }
    })

    return {
      wethDatum,
      wbtcDatum,
      wethWbtcdatum,
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}

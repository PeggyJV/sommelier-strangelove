import { closestIndexTo, format } from "date-fns"
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
    let wethMap = new Map()
    let wbtcMap = new Map()
    let wethWbtcMap = new Map()
    wethGainPct.map((weth, index) => {
      const wbtc =
        wbtcGainPct[
          closestIndexTo(
            new Date(weth.date),
            wethGainPct.map((item) => new Date(item.date))
          )!
        ]
      if (wbtc) {
        wethMap.set(
          interval === "daily"
            ? format(new Date(weth.date), "dLL")
            : format(new Date(weth.date), "dHH"),
          {
            x: new Date(weth.date),
            y: weth.change,
          }
        )
        wbtcMap.set(
          interval === "daily"
            ? format(new Date(wbtc.date), "dLL")
            : format(new Date(wbtc.date), "dHH"),
          {
            x: new Date(wbtc.date),
            y: wbtc.change,
          }
        )
        wethWbtcMap.set(
          interval === "daily"
            ? format(new Date(weth.date), "dLL")
            : format(new Date(weth.date), "dHH"),
          {
            x: new Date(weth.date),
            y: (weth.change + wbtc.change) / 2,
          }
        )
      }
    })
    return {
      wethDatum: Array.from(wethMap, ([_, v]) => v),
      wbtcDatum: Array.from(wbtcMap, ([_, v]) => v),
      wethWbtcdatum: Array.from(wethWbtcMap, ([_, v]) => v),
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}

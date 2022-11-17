import { closestIndexTo, format } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { fetchMarketChart } from "./fetchMarketChart"

interface PriceData {
  date: number
  change: number
  value: number
}

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
      let res: PriceData[] = []
      wethData.prices.map(([date, value], index) => {
        const firstData = wethData.prices[0]
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
      wbtcData.prices.map(([date, value], index) => {
        const firstData = wbtcData.prices[0]
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
        wethMap.set(
          interval === "daily"
            ? format(new Date(weth.date), "dLL")
            : format(new Date(weth.date), "dHH"),
          {
            x: new Date(weth.date),
            y: weth.change,
            value: weth.value,
          }
        )
        wbtcMap.set(
          interval === "daily"
            ? format(new Date(wbtc.date), "dLL")
            : format(new Date(wbtc.date), "dHH"),
          {
            x: new Date(wbtc.date),
            y: wbtc.change,
            value: wbtc.value,
          }
        )
        wethWbtcMap.set(
          interval === "daily"
            ? format(new Date(weth.date), "dLL")
            : format(new Date(weth.date), "dHH"),
          {
            x: new Date(weth.date),
            y: (weth.change + wbtc.change) / 2,
            value: (weth.value + wbtc.value) / 2,
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

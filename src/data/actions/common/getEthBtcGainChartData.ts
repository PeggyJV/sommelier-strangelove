import { closestIndexTo, format, isSameDay, subDays } from "date-fns"
import { getGainPct } from "utils/getGainPct"
import { GetAssetGainChartDataProps, PriceData } from "../types"
import { MarketChartResponse } from "./fetchMarketChart"

export type EthBtcGainChartData = Awaited<
  ReturnType<typeof getEthBtcGainChartData>
>

interface GetEthBtcGainChartData extends GetAssetGainChartDataProps {
  wethData: MarketChartResponse
  wbtcData: MarketChartResponse
  usdcData: MarketChartResponse
}

// Shift back 1 day coin gecko price is intentional
export const getEthBtcGainChartData = async (
  props: GetEthBtcGainChartData
) => {
  try {
    const { day, interval, firstDate } = props
    const isDaily = interval === "daily"
    const wethData = props.wethData
    const wbtcData = props.wbtcData
    const usdcData = props.usdcData

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

    let wethMap = new Map()
    let wbtcMap = new Map()
    let usdcMap = new Map()
    // let wethWbtcMap = new Map()
    wethGainPct.map((weth) => {
      const wbtc =
        wbtcGainPct[
          closestIndexTo(
            new Date(weth.date),
            wethGainPct.map((item) => new Date(item.date))
          )!
        ]
      const usdc =
        usdcGainPct[
          closestIndexTo(
            new Date(weth.date),
            wethGainPct.map((item) => new Date(item.date))
          )!
        ]
      const getKey = (date: number) =>
        format(new Date(date), interval === "daily" ? "dLL" : "dHH")
      if (wbtc) {
        if (!wethMap.has(getKey(weth.date))) {
          wethMap.set(getKey(weth.date), {
            x: isDaily
              ? subDays(new Date(weth.date), 1)
              : new Date(weth.date),
            y: weth.change,
            value: weth.value.toFixed(2),
          })
        }
        if (!wbtcMap.has(getKey(wbtc.date))) {
          wbtcMap.set(getKey(wbtc.date), {
            x: isDaily
              ? subDays(new Date(wbtc.date), 1)
              : new Date(wbtc.date),
            y: wbtc.change,
            value: wbtc.value.toFixed(2),
          })
        }
        if (!usdcMap.has(getKey(usdc.date))) {
          usdcMap.set(getKey(usdc.date), {
            x: isDaily
              ? subDays(new Date(usdc.date), 1)
              : new Date(usdc.date),
            y: usdc.change,
            value: usdc.value.toFixed(6),
          })
        }
        // if (!wethWbtcMap.has(getKey(weth.date))) {
        //   wethWbtcMap.set(getKey(weth.date), {
        //     x: isDaily
        //       ? subDays(new Date(weth.date), 1)
        //       : new Date(weth.date),
        //     y: (weth.change + wbtc.change) / 2,
        //     value: ((weth.value + wbtc.value) / 2).toFixed(2),
        //   })
        // }
      }
    })

    return {
      wethDatum: Array.from(wethMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
      wbtcDatum: Array.from(wbtcMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
      // wethWbtcdatum: Array.from(wethWbtcMap, ([_, v]) => v).slice(
      //   isDaily ? 1 : 0
      // ),
      usdcDatum: Array.from(usdcMap, ([_, v]) => v).slice(
        isDaily ? 1 : 0
      ),
    }
  } catch (error) {
    console.warn(error)
    throw error
  }
}

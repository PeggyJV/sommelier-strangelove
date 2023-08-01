import { AllContracts } from "../types"

import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { getStrategyData } from "./getStrategyData"
import { reactQueryClient } from "utils/reactQuery"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { tokenConfig } from "data/tokenConfig"

export const getAllStrategiesData = async ({
  allContracts,
  sommPrice,
  sgData,
}: {
  allContracts: AllContracts
  sommPrice: string
  sgData?: GetAllStrategiesDataQuery
}) => {
  if (!sgData) return []
  const data = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const result = await reactQueryClient.fetchQuery(
          ["USE_STRATEGY_DATA", { provider: true, address }],
          async () => {
            let subgraphData = sgData.cellars.find(
              (v) => v.id.toLowerCase() === address.toLowerCase()
            )
            const baseAsset = tokenConfig.find(
              (token) => token.symbol === subgraphData?.asset.symbol
            )
            const baseAssetPrice = await fetchCoingeckoPrice(
              baseAsset?.coinGeckoId ?? "usd-coin",
              "usd"
            )

            // Alter dayDatas to add in monthly data 
            if (
              subgraphData?.lastMonthData &&
              subgraphData?.dayDatas
            ) {
              // Check if not empty
              if (
                subgraphData.lastMonthData.length != 0 &&
                subgraphData.dayDatas.length != 0
              ) {
                // Insert first months day data at beginning of dayDatas
                subgraphData?.dayDatas.splice(
                  0,
                  0,
                  subgraphData.lastMonthData[0]
                )
              }
            }
            
            try {
              return await getStrategyData({
                address,
                sgData: subgraphData,
                sommPrice,
                contracts: contracts,
                decimals: subgraphData?.asset.decimals ?? 6,
                baseAssetPrice: baseAssetPrice!,
                symbol: subgraphData?.asset.symbol ?? "USDC",
              })
            } catch (error) {
              console.error(error)
            }
          },
          {}
        )

        return result
      }
    )
  )
  type Data = Awaited<ReturnType<typeof getStrategyData>>
  const isData = (item: Data | null): item is Data => {
    return !!item
  }
  const cleanData = data.filter(isData)
  return cleanData
}

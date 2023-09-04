import { AllContracts } from "../types"

import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { getStrategyData } from "./getStrategyData"
import { reactQueryClient } from "utils/reactQuery"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"

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
            const subgraphData = sgData.cellars.find(
              (v) => v.id.toLowerCase() === address.toLowerCase()
            )
            
            const strategy = Object.values(cellarDataMap).find(
              ({ config }) =>
                config.cellar.address.toLowerCase() ===
                address.toLowerCase()
            )!
            const config: ConfigProps = strategy.config!

            const baseAsset = config.baseAsset
            const baseAssetPrice = await fetchCoingeckoPrice(
              baseAsset?.coinGeckoId ?? "usd-coin",
              "usd"
            )

            try {
              return await getStrategyData({
                address,
                sgData: subgraphData,
                sommPrice,
                contracts: contracts,
                baseAssetPrice: baseAssetPrice!,
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

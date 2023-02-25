import { AllContracts } from "../types"

import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { getStrategyData } from "./getStrategyData"
import { reactQueryClient } from "utils/reactQuery"

export const getAllStrategiesData = async ({
  allContracts,
  sommPrice,
  sgData,
}: {
  allContracts: AllContracts
  sommPrice: string
  sgData: GetAllStrategiesDataQuery
}) => {
  const data = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const result = await reactQueryClient.fetchQuery(
          ["USE_STRATEGY_DATA", { provider: true, address }],
          async () => {
            const subgraphData = sgData.cellars.find(
              (v) => v.id === address
            )
            if (!subgraphData) return
            return await getStrategyData({
              address,
              sgData: subgraphData,
              sommPrice,
              contracts: contracts,
            })
          }
        )

        return result
      }
    )
  )
  const cleanData = data.filter((d) => d)
  return cleanData
}

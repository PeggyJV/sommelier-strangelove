import { AllContracts } from "../types"

import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { QueryClient } from "@tanstack/react-query"
import { reactQueryConfig } from "utils/reactQueryConfig"
import { getStrategyData } from "./getStrategyData"

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
        const queryClient = new QueryClient(reactQueryConfig)
        const result = await queryClient.fetchQuery(
          ["USE_STRATEGY_DATA", { provider: true, sgData, address }],
          async () =>
            await getStrategyData({
              address,
              sgData,
              sommPrice,
              contracts: contracts,
            })
        )

        return result
      }
    )
  )
  return data
}

import { AllContracts } from "../types"

import { GetAllStrategiesDataQuery } from "generated/subgraph"
import { getStrategyData } from "./getStrategyData"
import { reactQueryClient } from "utils/reactQuery"

export const getAllStrategiesData = async ({
  allContracts,
  sommPrice,
  wethPrice,
  sgData,
}: {
  allContracts: AllContracts
  sommPrice: string
  wethPrice: string
  sgData?: GetAllStrategiesDataQuery
}) => {
  const data = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([address, contracts]) => {
        const result = await reactQueryClient.fetchQuery(
          ["USE_STRATEGY_DATA", { provider: true, address }],
          async () => {
            const subgraphData =
              sgData &&
              sgData?.cellars?.find(
                (v) => v.id.toLowerCase() === address.toLowerCase()
              )
            return await getStrategyData({
              address,
              sgData: subgraphData,
              sommPrice,
              wethPrice,
              contracts: contracts,
            })
          },
          {}
        )

        return result
      }
    )
  )
  type Data = Awaited<ReturnType<typeof getStrategyData>>
  const isData = (item: Data | undefined): item is Data => {
    return !!item
  }
  const cleanData = data.filter(isData)
  return cleanData
}

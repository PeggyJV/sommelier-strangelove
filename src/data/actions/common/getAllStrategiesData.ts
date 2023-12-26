import { AllContracts } from "../types"
import { GetAllStrategiesDataQuery } from "data/actions/types"
import { getStrategyData } from "./getStrategyData"
import { reactQueryClient } from "utils/reactQuery"
import { fetchCoingeckoPrice } from "queries/get-coingecko-price"
import { cellarDataMap } from "data/cellarDataMap"
import { ConfigProps } from "data/types"

export const getAllStrategiesData = async ({
  allContracts,
  sommPrice,
  cellarData,
}: {
  allContracts: AllContracts
  sommPrice: string
  cellarData?: GetAllStrategiesDataQuery
}) => {
  if (!cellarData) return []
  const data = await Promise.all(
    Object.entries(allContracts)?.map(
      async ([key, contracts]) => {
        const result = await reactQueryClient.fetchQuery(
          [
            "USE_STRATEGY_DATA",
            { provider: true, address: key.split("-")[0] },
          ],
          async () => {
            // Get the contract's chain
            let chain = ""
            if (contracts.chain !== "ethereum") {
              chain = "-" + contracts.chain
            }

            // If chain is not ethereum, key format is '{address}-{chain}', otherwise it is '{address}'
            const address = key.split("-")[0]

            // Note: the id contaisn the address + the chain if it is not ethereum
            const cleanCellarData = cellarData.cellars.find(
              (v) =>
                v.id.toLowerCase() === address.toLowerCase() + chain
            )

            const strategy = Object.values(cellarDataMap).find(
              ({ config }) =>
                config.cellar.address.toLowerCase() ===
                  address.toLowerCase() &&
                config.chain.id === contracts.chain
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
                stratData: cleanCellarData,
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

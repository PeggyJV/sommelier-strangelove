import { useQuery } from "@tanstack/react-query"
import { getStrategyData } from "data/actions/common/getStrategyData"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStrategyDataQuery } from "src/data/actions/types"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { fetchIndividualCellarStrategyData } from "queries/get-individual-strategy-data"
import { useState, useEffect } from "react"

export const useStrategyData = (address: string, chain: string) => {
  const provider = useProvider()

  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")

  const [stratData, setStratData] = useState<
    GetStrategyDataQuery | undefined
  >(undefined)
  const [error, setError] = useState(null)

  const cellarData = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
      address.toLowerCase() && item.config.chain.id === chain
  )!

  useEffect(() => {
    fetchIndividualCellarStrategyData(address.toLowerCase(), cellarData.config.chain.id)
      .then(({ data, error }) => {
        if (error) {
          setError(error)
        } else {
          setStratData(data)
        }
      })
      .catch((error) => setError(error))
  }, [])

  const config = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
      address.toLowerCase() && item.config.chain.id === chain
  )!.config
  const isNoDataSource = Boolean(config!.isNoDataSource)
  const baseAsset = config.baseAsset.coinGeckoId
  const { data: baseAssetPrice } = useCoinGeckoPrice(
    baseAsset ?? "usd-coin"
  )
  // if chain is not ethereum, key format is '{address}-{chain}', otherwise it is '{address}'
  const key = address + (config.chain.id !== "ethereum" ? ("-" + chain) : "")

  // Get cellar contracts for the chain  
  const query = useQuery(
    [
      "USE_STRATEGY_DATA",
      { provider: provider?._isProvider, address: key },
    ],
    async () => {
      const result = await getStrategyData({
        address,
        contracts: allContracts![key]!,
        sommPrice: sommPrice ?? "0",
        stratData: stratData?.cellar,
        baseAssetPrice: baseAssetPrice ?? "0",
      })

      return result
    },
    {
      enabled:
        !!allContracts &&
        !!sommPrice &&
        (isNoDataSource || !!stratData) &&
        !!baseAssetPrice,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError
  }
}

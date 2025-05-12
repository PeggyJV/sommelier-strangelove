import { useQuery } from "@tanstack/react-query"
import { getStrategyData } from "data/actions/common/getStrategyData"
import { cellarDataMap } from "data/cellarDataMap"
import { GetStrategyDataQuery } from "src/data/actions/types"
import { usePublicClient } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { fetchIndividualCellarStrategyData } from "queries/get-individual-strategy-data"
import { useState, useEffect } from "react"
import { tokenConfig } from "data/tokenConfig"

export const useStrategyData = (address: string, chain: string) => {
  const publicClient = usePublicClient()

  const { data: allContracts } = useAllContracts()
  const sommToken = tokenConfig.find(
    (token) =>
      token.coinGeckoId === "sommelier" &&
      token.chain === chain
  )!

  const { data: sommPrice } = useCoinGeckoPrice(sommToken)

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
    fetchIndividualCellarStrategyData(
      address.toLowerCase(),
      cellarData.config.chain.id
    )
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
  const baseAsset = config.baseAsset
  const { data: baseAssetPrice } = useCoinGeckoPrice(
    baseAsset
  )

  // if chain is not ethereum, key format is '{address}-{chain}', otherwise it is '{address}'
  const key =
    address + (config.chain.id !== "ethereum" ? "-" + chain : "")

  // Get cellar contracts for the chain
  const query = useQuery({
    queryKey: [
      "USE_STRATEGY_DATA",
      { provider: publicClient?.uid, address: key },
    ],
    queryFn: async () => {
      const result = await getStrategyData({
        address,
        contracts: allContracts![key]!,
        sommPrice: sommPrice ?? "0",
        stratData: structuredClone(stratData?.cellar),
        baseAssetPrice: baseAssetPrice ?? "0",
      })

      return result
    },
    enabled:
      !!allContracts &&
      !!sommPrice &&
      (isNoDataSource || !!stratData) &&
      !!baseAssetPrice,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
  }
}

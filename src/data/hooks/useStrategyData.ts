import { useQuery } from "@tanstack/react-query"
import { getStrategyData } from "data/actions/common/getStrategyData"
import { useGetStrategyDataQuery } from "generated/subgraph"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { cellarDataMap } from "data/cellarDataMap"
import { useUserBalances } from "./useUserBalances"
import { tokenConfig } from "data/tokenConfig"

export const useStrategyData = (address: string) => {
  const provider = useProvider()

  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")
  const [{ data: sgData, error }, reFetch] = useGetStrategyDataQuery({
    variables: { cellarAddress: address.toLowerCase() },
  })
  const config = Object.values(cellarDataMap).find(
    (item) =>
      item.config.cellar.address.toLowerCase() ===
      address.toLowerCase()
  )!.config
  const isNoSubgraph = Boolean(config!.noSubgraph)
  const baseAsset = tokenConfig.find(
    (token) => token.symbol === sgData?.cellar?.asset.symbol
  )?.coinGeckoId
  const { data: baseAssetPrice } = useCoinGeckoPrice(
    baseAsset ?? "usd-coin"
  )

  const query = useQuery(
    [
      "USE_STRATEGY_DATA",
      { provider: provider?._isProvider, address },
    ],
    async () => {
      const result = await getStrategyData({
        address,
        contracts: allContracts![address]!,
        sommPrice: sommPrice!,
        sgData: sgData?.cellar!,
        decimals: sgData?.cellar?.asset.decimals ?? 6,
        baseAssetPrice: baseAssetPrice!,
        symbol: sgData?.cellar?.asset.symbol ?? "USDC",
      })

      return result
    },
    {
      enabled:
        !!allContracts &&
        !!sommPrice &&
        (isNoSubgraph || !!sgData) &&
        !!baseAssetPrice,
    }
  )

  return {
    ...query,
    isError: Boolean(error) || query.isError,
    refetch: () => {
      reFetch()
      query.refetch()
    },
  }
}

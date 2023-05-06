import { useQuery } from "@tanstack/react-query"
import { getStrategyData } from "data/actions/common/getStrategyData"
import { useGetStrategyDataQuery } from "generated/subgraph"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"
import { cellarDataMap } from "data/cellarDataMap"
// import { config } from "utils/config"
// // import { formatCurrency } from "utils/formatCurrency"
// // import { BigNumber } from "bignumber.js"
// // const RYETH_ADDRESS = config.CONTRACT.REAL_YIELD_ETH.ADDRESS

export const useStrategyData = (address: string) => {
  const provider = useProvider()

  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")
  const [{ data: sgData, error }, reFetch] = useGetStrategyDataQuery({
    variables: { cellarAddress: address },
  })

  const isNoSubgraph = Boolean(
    Object.values(cellarDataMap).find(
      (item) => item.config.cellar.address === address
    )?.config.noSubgraph
  )

  const { data: wethPrice } = useCoinGeckoPrice("weth")

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
        wethPrice: wethPrice!,
        sgData: sgData?.cellar!,
      })

      return result
    },
    {
      enabled:
        !!allContracts &&
        !!sommPrice &&
        !!wethPrice &&
        (isNoSubgraph || !!sgData),
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

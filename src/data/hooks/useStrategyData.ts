import { useQuery } from "@tanstack/react-query"
import { getStrategyData } from "data/actions/common/getStrategyData"
import { useGetAllStrategiesDataQuery } from "generated/subgraph"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"

export const useStrategyData = (address: string) => {
  const provider = useProvider()

  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")
  const [{ data: sgData, error }, reFetch] =
    useGetAllStrategiesDataQuery()

  const query = useQuery(
    [
      "USE_STRATEGY_DATA",
      { provider: provider?._isProvider, sgData, address },
    ],
    async () => {
      return await getStrategyData({
        address,
        contracts: allContracts![address]!,
        sommPrice: sommPrice!,
        sgData: sgData!,
      })
    },
    {
      enabled: !!allContracts && !!sommPrice && !!sgData,
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

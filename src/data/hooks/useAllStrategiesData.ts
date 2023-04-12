import { useQuery } from "@tanstack/react-query"
import { getAllStrategiesData } from "data/actions/common/getAllStrategiesData"
import { useGetAllStrategiesDataQuery } from "generated/subgraph"
import { useProvider } from "wagmi"
import { useAllContracts } from "./useAllContracts"
import { useCoinGeckoPrice } from "./useCoinGeckoPrice"

export const useAllStrategiesData = () => {
  const provider = useProvider()

  const { data: allContracts } = useAllContracts()
  const { data: sommPrice } = useCoinGeckoPrice("sommelier")
  const { data: wethPrice } = useCoinGeckoPrice("weth")
  const [{ data: sgData, error }, reFetch] =
    useGetAllStrategiesDataQuery()

  const query = useQuery(
    ["USE_ALL_STRATEGIES_DATA", { provider: provider?._isProvider }],
    async () => {
      return await getAllStrategiesData({
        allContracts: allContracts!,
        sommPrice: sommPrice!,
        wethPrice: wethPrice!,
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
